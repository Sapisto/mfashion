import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Vercel Cron calls this every hour.
// Orders stuck in PENDING payment for over 24h are expired — marked
// CANCELLED / FAILED so the admin still sees them in the orders list.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db.order.updateMany({
    where: {
      paymentStatus: "PENDING",
      createdAt: { lt: cutoff },
    },
    data: {
      paymentStatus: "FAILED",
      status: "CANCELLED",
    },
  });

  console.log(
    `[cron] expire-pending-orders: cancelled ${result.count} order(s) older than ${cutoff.toISOString()}`
  );

  return NextResponse.json({ cancelled: result.count, cutoff });
}

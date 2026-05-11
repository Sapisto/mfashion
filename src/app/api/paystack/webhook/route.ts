import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference = event.data.reference as string;
    const order = await db.order.update({
      where: { paymentRef: reference },
      data: { paymentStatus: "PAID", status: "PROCESSING" },
      include: { items: true },
    }).catch(() => null);

    if (order) {
      await Promise.all(
        order.items.map((item) =>
          db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }).catch(() => null)
        )
      );
    }
  }

  return NextResponse.json({ received: true });
}

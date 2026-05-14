import { NextResponse } from "next/server";
import { createOrder, OrderError } from "@/lib/services/order.service";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, address, city, state, notes, items } = body;

    if (!customerName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await createOrder(
      { customerName, customerEmail, customerPhone, address, city, state, notes, items },
      appUrl
    );
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

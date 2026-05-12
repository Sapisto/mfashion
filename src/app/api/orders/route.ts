import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initializeTransaction, generateReference, toKobo } from "@/lib/paystack";
import { sendOrderEmails } from "@/lib/email";
import { getShippingFee } from "@/lib/utils";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, address, city, state, notes, items } = body;

    if (!customerName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Fetch real prices from DB — never trust client-sent prices ──────────
    const productIds: string[] = items.map((i: { productId: string }) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const verifiedItems: {
      productId: string; quantity: number; size?: string;
      color?: string; price: number; productName: string; productImage?: string;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product is no longer available` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} unit(s) of ${product.name} in stock` },
          { status: 400 }
        );
      }

      subtotal += product.price * item.quantity;
      verifiedItems.push({
        productId: product.id,
        quantity: item.quantity,
        size: item.size ?? null,
        color: item.color ?? null,
        price: product.price,          // DB price — not client price
        productName: product.name,
        productImage: product.images[0] ?? null,
      });
    }

    const shippingFee = getShippingFee(state ?? "");
    const total = subtotal + shippingFee;

    // Create order
    const order = await db.order.create({
      data: {
        customerName, customerEmail, customerPhone,
        address, city, state, notes, total,
        items: { create: verifiedItems },
      },
    });

    const reference = generateReference(order.id);
    await db.order.update({ where: { id: order.id }, data: { paymentRef: reference } });

    const paystack = await initializeTransaction({
      email: customerEmail,
      amount: toKobo(total),
      reference,
      callback_url: `${appUrl}/checkout/verify?reference=${reference}`,
      metadata: { order_id: order.id, customer_name: customerName, customer_phone: customerPhone },
    });

    sendOrderEmails({
      orderId: order.id, customerName, customerEmail, customerPhone,
      address, city, state, total, notes: notes ?? null,
      items: verifiedItems,
    });

    return NextResponse.json({ orderId: order.id, authorizationUrl: paystack.data.authorization_url });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

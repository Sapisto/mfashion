import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  initializeTransaction,
  generateReference,
  toKobo,
} from "@/lib/paystack";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      notes,
      items,
      total,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify stock for all items
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.productName} is no longer available` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Only ${product.stock} unit(s) of ${product.name} in stock`,
          },
          { status: 400 }
        );
      }
    }

    // Create order
    const order = await db.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        state,
        notes,
        total,
        items: {
          create: items.map(
            (i: {
              productId: string;
              quantity: number;
              size?: string;
              color?: string;
              price: number;
              productName: string;
              productImage?: string;
            }) => ({
              productId: i.productId,
              quantity: i.quantity,
              size: i.size ?? null,
              color: i.color ?? null,
              price: i.price,
              productName: i.productName,
              productImage: i.productImage ?? null,
            })
          ),
        },
      },
    });

    const reference = generateReference(order.id);

    // Save payment reference
    await db.order.update({
      where: { id: order.id },
      data: { paymentRef: reference },
    });

    // Initialize Paystack
    const paystack = await initializeTransaction({
      email: customerEmail,
      amount: toKobo(total),
      reference,
      callback_url: `${appUrl}/checkout/verify?reference=${reference}`,
      metadata: {
        order_id: order.id,
        customer_name: customerName,
        customer_phone: customerPhone,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      authorizationUrl: paystack.data.authorization_url,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

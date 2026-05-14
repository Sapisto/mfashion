import { db } from "@/lib/db";
import { initializeTransaction, generateReference, toKobo } from "@/lib/paystack";
import { sendOrderEmails } from "@/lib/email";
import { getShippingFee } from "@/lib/shipping";

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
  items: CartItem[];
}

export async function createOrder(input: CreateOrderInput, appUrl: string) {
  const { customerName, customerEmail, customerPhone, address, city, state, notes, items } = input;

  const productIds = items.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const verifiedItems: {
    productId: string; quantity: number; size?: string | null;
    color?: string | null; price: number; productName: string; productImage?: string | null;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) throw new OrderError("Product is no longer available");
    if (product.stock < item.quantity) {
      throw new OrderError(`Only ${product.stock} unit(s) of ${product.name} in stock`);
    }

    subtotal += product.price * item.quantity;
    verifiedItems.push({
      productId: product.id,
      quantity: item.quantity,
      size: item.size ?? null,
      color: item.color ?? null,
      price: product.price,
      productName: product.name,
      productImage: product.images[0] ?? null,
    });
  }

  const shippingFee = getShippingFee(state ?? "");
  const total = subtotal + shippingFee;

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

  return { orderId: order.id, authorizationUrl: paystack.data.authorization_url };
}

import { Resend } from "resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";
import { NewOrderAlertEmail } from "@/emails/NewOrderAlert";

const FROM = process.env.EMAIL_FROM ?? "AIE Clothing Africa <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "abdulazeezalasa@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347079727740";

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  total: number;
  notes?: string | null;
  items: {
    productName: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
    price: number;
    productImage?: string | null;
  }[];
}

export async function sendOrderEmails(data: OrderEmailData) {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("re_xxx")) return; // skip if key not configured

  const resend = new Resend(key);
  const shortId = data.orderId.slice(-8).toUpperCase();
  const ngnFormat = new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0,
  });

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: data.customerEmail,
        subject: `Order Confirmed — #${shortId} | AIE Clothing Africa`,
        html: await render(OrderConfirmationEmail({
          customerName: data.customerName,
          orderId: data.orderId,
          items: data.items,
          total: data.total,
          address: data.address,
          city: data.city,
          state: data.state,
          whatsappNumber: WHATSAPP,
        })),
      }),
      resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `🛍️ New Order #${shortId} — ${ngnFormat.format(data.total)}`,
        html: await render(NewOrderAlertEmail({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          orderId: data.orderId,
          items: data.items,
          total: data.total,
          address: data.address,
          city: data.city,
          state: data.state,
          notes: data.notes,
          adminUrl: `${APP_URL}/admin/orders/${data.orderId}`,
        })),
      }),
    ]);
  } catch (err) {
    console.error("Email send error:", err);
  }
}

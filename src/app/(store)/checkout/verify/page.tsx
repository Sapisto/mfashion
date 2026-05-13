import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";
import { formatPrice } from "@/lib/utils";
import { ClearCart } from "@/components/store/ClearCart";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.reference;
  const reference = Array.isArray(raw) ? raw[0] : raw;

  if (!reference) redirect("/");

  let success = false;
  let orderTotal = 0;
  let customerName = "";

  try {
    const result = await verifyTransaction(reference);
    const paystackStatus = result.data.status;

    if (paystackStatus === "success") {
      success = true;
      
      try {
        // Mark order as paid
        const order = await db.order.update({
          where: { paymentRef: reference },
          data: { paymentStatus: "PAID", status: "PROCESSING" },
          include: { items: true },
        });
        orderTotal = order.total;
        customerName = order.customerName;

        // Decrement stock for each purchased item
        await Promise.all(
          order.items.map((item) =>
            db.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            }).catch(() => null) // ignore if product was deleted
          )
        );
      } catch (dbErr) {
        console.error("[verify] DB update error (payment was successful):", dbErr);
      }
    } else {
      try {
        await db.order.update({
          where: { paymentRef: reference },
          data: { paymentStatus: "FAILED" },
        });
      } catch {
        // order may not exist yet, ignore
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (!msg.toLowerCase().includes("not found")) {
      console.error("[verify] Paystack error:", err);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {success ? (
        <>
          <ClearCart />
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-5" />
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-2">
            Order Confirmed!
          </h1>
          <p className="text-brand-muted mb-2">
            Thank you{customerName ? `, ${customerName.split(" ")[0]}` : ""}! 🎉
          </p>
          <p className="text-brand-muted mb-1 text-sm">
            Amount paid:{" "}
            <span className="font-semibold text-brand-charcoal">
              {formatPrice(orderTotal)}
            </span>
          </p>
          <p className="text-brand-muted text-sm mb-8">
            You'll receive a confirmation shortly. We'll contact you when your
            order ships.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347079727740"}?text=Hi! I just placed an order (ref: ${reference}). When will it be ready?`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-semibold text-sm rounded-sm transition-colors mb-3"
          >
            Track on WhatsApp
          </a>
          <br />
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-brand-terracotta hover:text-brand-terracotta-dark font-semibold text-sm transition-colors"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-5" />
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-2">
            Payment Failed
          </h1>
          <p className="text-brand-muted mb-8">
            We couldn't process your payment. No money was charged. Please try
            again or contact us on WhatsApp.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-8 py-4 font-semibold text-sm rounded-sm transition-colors"
          >
            Try Again <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </div>
  );
}

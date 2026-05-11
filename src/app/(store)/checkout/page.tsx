"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, NIGERIAN_STATES } from "@/lib/utils";

const schema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z
    .string()
    .min(10, "Valid phone number required")
    .max(14),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            price: i.price,
            productName: i.name,
            productImage: i.image,
          })),
          total: totalPrice(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong");
        return;
      }

      // Cart is cleared in /checkout/verify after payment is confirmed
      window.location.href = json.authorizationUrl;
    } catch {
      toast.error("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const subtotal = totalPrice();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 space-y-8"
        >
          {/* Contact info */}
          <section>
            <h2 className="font-semibold text-brand-charcoal text-lg mb-5 pb-2 border-b border-brand-border">
              Contact Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.customerName?.message}>
                <input
                  {...register("customerName")}
                  placeholder="Amaka Okonkwo"
                  className="input-field"
                />
              </Field>
              <Field label="Email Address" error={errors.customerEmail?.message}>
                <input
                  {...register("customerEmail")}
                  type="email"
                  placeholder="amaka@example.com"
                  className="input-field"
                />
              </Field>
              <Field label="Phone Number" error={errors.customerPhone?.message}>
                <input
                  {...register("customerPhone")}
                  type="tel"
                  placeholder="0801 234 5678"
                  className="input-field sm:col-span-2"
                />
              </Field>
            </div>
          </section>

          {/* Delivery address */}
          <section>
            <h2 className="font-semibold text-brand-charcoal text-lg mb-5 pb-2 border-b border-brand-border">
              Delivery Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Street Address"
                error={errors.address?.message}
                className="sm:col-span-2"
              >
                <input
                  {...register("address")}
                  placeholder="12 Banana Island Road, Ikoyi"
                  className="input-field"
                />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input
                  {...register("city")}
                  placeholder="Lagos"
                  className="input-field"
                />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <select {...register("state")} className="input-field">
                  <option value="">Select state…</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Order Notes (optional)"
                error={errors.notes?.message}
                className="sm:col-span-2"
              >
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Special instructions, colour preferences, etc."
                  className="input-field resize-none"
                />
              </Field>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-60 text-white py-4 font-semibold text-sm tracking-wide rounded-sm transition-colors"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Processing…" : "Pay Securely with Paystack"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <div className="bg-brand-sand rounded-sm p-6 sticky top-24">
            <h2 className="font-heading text-lg font-bold text-brand-charcoal mb-5">
              Your Order
            </h2>
            <ul className="space-y-4 mb-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 items-start">
                  <div className="relative w-14 aspect-[3/4] shrink-0 rounded-sm overflow-hidden bg-white">
                    <Image
                      src={item.image || "/placeholder-product.svg"}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-terracotta text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand-charcoal leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    {(item.size || item.color) && (
                      <p className="text-[10px] text-brand-muted mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-brand-charcoal shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-brand-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-charcoal">
                <span>Total (NGN)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-brand-muted">
              <Lock className="h-3.5 w-3.5 text-green-600" />
              <span>Payments secured by Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

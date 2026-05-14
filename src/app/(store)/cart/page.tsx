"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-14 w-14 text-brand-border mx-auto mb-5" />
        <h1 className="font-heading text-2xl font-bold text-brand-charcoal mb-2">
          Your cart is empty
        </h1>
        <p className="text-brand-muted mb-8">
          Looks like you haven&apos;t added any pieces yet.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-8 py-4 font-semibold text-sm tracking-wide rounded-sm transition-colors"
        >
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-3xl font-bold text-brand-charcoal mb-10">
        Cart ({items.length})
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 bg-white rounded-sm p-4 shadow-sm border border-brand-border"
            >
              <div className="relative w-24 aspect-[3/4] shrink-0 rounded-sm overflow-hidden bg-brand-sand">
                <Image
                  src={item.image || "/placeholder-product.svg"}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="font-medium text-brand-charcoal hover:text-brand-terracotta transition-colors text-sm leading-snug"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="shrink-0 p-1 hover:text-red-500 transition-colors text-brand-muted"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {(item.size || item.color) && (
                  <p className="text-xs text-brand-muted mt-0.5">
                    {[item.size, item.color].filter(Boolean).join(" · ")}
                  </p>
                )}

                <p className="text-sm font-bold text-brand-charcoal mt-1">
                  {formatPrice(item.price)}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
                    }
                    className="w-7 h-7 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-terracotta hover:text-brand-terracotta transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
                    }
                    disabled={item.quantity >= item.stock}
                    className="w-7 h-7 rounded-full border border-brand-border flex items-center justify-center hover:border-brand-terracotta hover:text-brand-terracotta transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <span className="text-xs text-brand-muted ml-auto">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-brand-sand rounded-sm p-6 sticky top-24">
            <h2 className="font-heading text-xl font-bold text-brand-charcoal mb-5">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Delivery</span>
                <span className="text-brand-charcoal font-medium">
                  Calculated at checkout
                </span>
              </div>
              <div className="border-t border-brand-border pt-3 flex justify-between font-bold text-brand-charcoal text-base">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white py-4 font-semibold text-sm tracking-wide rounded-sm transition-colors"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/shop"
              className="mt-3 w-full flex items-center justify-center text-brand-muted hover:text-brand-charcoal text-sm transition-colors py-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

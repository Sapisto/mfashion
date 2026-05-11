"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export function CartButton() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:text-brand-terracotta transition-colors"
      aria-label={`Cart (${totalItems} items)`}
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-brand-terracotta text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

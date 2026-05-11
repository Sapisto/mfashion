"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface Props {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}

export function AddToCartButton({ product, selectedSize, selectedColor }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const needsSize = product.sizes.length > 0 && !selectedSize;
  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (outOfStock) return;
    if (needsSize) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      id: `${product.id}:${selectedSize ?? ""}:${selectedColor ?? ""}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      size: selectedSize,
      color: selectedColor,
      slug: product.slug,
      stock: product.stock,
    });

    setAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className={`w-full flex items-center justify-center gap-3 py-4 px-8 font-semibold text-sm tracking-wide transition-all rounded-sm ${
        outOfStock
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : added
          ? "bg-green-600 text-white"
          : "bg-brand-charcoal hover:bg-brand-terracotta text-white"
      }`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added to Cart
        </>
      ) : outOfStock ? (
        "Sold Out"
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </>
      )}
    </button>
  );
}

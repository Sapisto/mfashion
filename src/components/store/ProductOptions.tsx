"use client";

import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export function ProductOptions({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length === 1 ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors.length === 1 ? product.colors[0] : undefined
  );

  return (
    <div className="space-y-6">
      {/* Size */}
      {product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
              Size
            </p>
            {selectedSize && (
              <span className="text-xs text-brand-muted">{selectedSize}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                  selectedSize === s
                    ? "border-brand-charcoal bg-brand-charcoal text-white"
                    : "border-brand-border text-brand-charcoal hover:border-brand-terracotta"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {product.colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
              Color
            </p>
            {selectedColor && (
              <span className="text-xs text-brand-muted">{selectedColor}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                  selectedColor === c
                    ? "border-brand-charcoal bg-brand-charcoal text-white"
                    : "border-brand-border text-brand-charcoal hover:border-brand-terracotta"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs font-semibold text-amber-600">
          Only {product.stock} left in stock!
        </p>
      )}

      <AddToCartButton
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    </div>
  );
}

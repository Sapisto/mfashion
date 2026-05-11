import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const image = product.images[0] ?? "/placeholder-product.svg";

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-brand-sand aspect-3/4">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="eager"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white text-brand-charcoal text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 border border-brand-border">
              Sold Out
            </span>
          </div>
        )}
        {product.isFeatured && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-brand-terracotta text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1">
            New
          </span>
        )}
      </div>
      <div className="pt-3 space-y-1">
        <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em]">
          {product.category?.name ?? "Fashion"}
        </p>
        <h3 className="text-sm text-brand-charcoal group-hover:text-brand-terracotta transition-colors leading-snug font-medium">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-brand-charcoal">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

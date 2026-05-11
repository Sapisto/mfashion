import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Package, RotateCcw, Shield } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductOptions } from "@/components/store/ProductOptions";
import type { Product } from "@/types";
import type { Metadata } from "next";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await db.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 4,
  });

  const p = product as unknown as Product;

  return (
    <div className="bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-8">
          <Link href="/" className="hover:text-brand-terracotta transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-terracotta transition-colors">
            Shop
          </Link>
          {p.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${p.category.slug}`}
                className="hover:text-brand-terracotta transition-colors"
              >
                {p.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-brand-charcoal">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={p.images} name={p.name} />

          {/* Info */}
          <div>
            {p.category && (
              <p className="text-brand-muted text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                {p.category.name}
              </p>
            )}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-3">
              {p.name}
            </h1>
            <p className="text-2xl font-bold text-brand-terracotta mb-6">
              {formatPrice(p.price)}
            </p>

            <p className="text-brand-muted leading-relaxed mb-8">
              {p.description}
            </p>

            {/* Size & Color + Add to cart */}
            <ProductOptions product={p} />

            {/* WhatsApp order */}
            <a
              href={`https://wa.me/${whatsapp}?text=Hello! I'd like to order the *${encodeURIComponent(p.name)}*. Is it available?`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-3 py-4 px-8 border border-brand-charcoal hover:border-brand-terracotta text-brand-charcoal hover:text-brand-terracotta font-semibold text-sm tracking-wide transition-colors rounded-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Order via WhatsApp
            </a>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-brand-border">
              {[
                { icon: Package, label: "Fast Delivery", sub: "Nationwide" },
                { icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
                { icon: Shield, label: "Secure Pay", sub: "Paystack" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="h-5 w-5 mx-auto text-brand-terracotta mb-1.5" />
                  <p className="text-xs font-semibold text-brand-charcoal">{label}</p>
                  <p className="text-[10px] text-brand-muted">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold text-brand-charcoal mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map((r) => (
                <ProductCard key={r.id} product={r as unknown as Product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

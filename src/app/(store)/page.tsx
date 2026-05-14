import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { getFeaturedProducts } from "@/lib/data/products";
import { getCategoriesWithImages } from "@/lib/data/categories";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347079727740";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesWithImages(),
  ]);

  return (
    <div className="bg-brand-cream">
      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-brand-terracotta mb-5">
              New Collection — 2026
            </p>
            <h1 className="font-heading font-light text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] text-brand-charcoal mb-8">
              African
              <br />
              <em className="font-medium">Fashion</em>
              <br />
              Redefined.
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/shop" className="btn-primary">
                Shop Collection
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=Hello! I'd like to enquire about your collections.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="hidden lg:flex items-end justify-end gap-3">
            {/* editorial stat blocks — product images as backgrounds */}
            <div className="space-y-3">
              {/* Tall block */}
              <div className="relative w-44 h-56 overflow-hidden bg-brand-charcoal flex flex-col justify-end p-5">
                {featured[0]?.images[0] && (
                  <Image src={featured[0].images[0]} alt="" fill sizes="176px" className="object-cover opacity-60" unoptimized />
                )}
                <div className="relative z-10">
                  <p className="font-heading text-5xl font-light text-white">500+</p>
                  <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Customers</p>
                </div>
              </div>
              {/* Short block */}
              <div className="relative w-44 h-28 overflow-hidden bg-brand-terracotta flex flex-col justify-end p-5">
                {featured[1]?.images[0] && (
                  <Image src={featured[1].images[0]} alt="" fill sizes="176px" className="object-cover opacity-50" unoptimized />
                )}
                <div className="relative z-10">
                  <p className="font-heading text-2xl font-medium text-white">Made in</p>
                  <p className="font-heading text-2xl font-medium text-white/70">Nigeria 🇳🇬</p>
                </div>
              </div>
            </div>
            {/* Tall side block */}
            <div className="relative w-36 h-96 overflow-hidden bg-brand-sand flex flex-col justify-end p-5">
              {featured[2]?.images[0] && (
                <Image src={featured[2].images[0]} alt="" fill sizes="144px" className="object-cover opacity-70" unoptimized />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10">
                <p className="font-heading text-lg font-light text-white leading-snug italic">
                  &ldquo;Wear your heritage with pride.&rdquo;
                </p>
                <div className="w-8 h-px bg-brand-gold mt-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="border-y border-brand-border py-3 overflow-hidden bg-white">
        <div className="flex gap-12 whitespace-nowrap animate-[scroll_20s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-12 text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-charcoal"
            >
              <span>Premium Ankara Fabrics</span>
              <span className="text-brand-terracotta">✦</span>
              <span>Made in Nigeria</span>
              <span className="text-brand-terracotta">✦</span>
              <span>Nationwide Delivery</span>
              <span className="text-brand-terracotta">✦</span>
              <span>Custom Orders Welcome</span>
              <span className="text-brand-terracotta">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading font-light text-4xl sm:text-5xl text-brand-charcoal">
            Collections
          </h2>
          <Link
            href="/shop"
            className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-muted hover:text-brand-charcoal transition-colors flex items-center gap-1.5"
          >
            All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-3/4 overflow-hidden flex flex-col justify-end"
            >
              {/* Background — real product image or fallback colour */}
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: cat.fallback }}
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Text */}
              <div className="relative z-10 p-5">
                <p className="font-heading text-white text-xl font-medium leading-tight">
                  {cat.name}
                </p>
                <p className="text-white/60 text-[11px] tracking-wide mt-1">
                  {cat.description}
                </p>
                <span className="inline-block mt-3 text-white/50 text-[10px] font-semibold tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                  Shop →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="border-t border-brand-border py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-brand-muted mb-2">
                  Handpicked
                </p>
                <h2 className="font-heading font-light text-4xl sm:text-5xl text-brand-charcoal">
                  Featured Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-brand-muted hover:text-brand-charcoal transition-colors"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND STORY ── */}
      <section className="border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual block — product images as backgrounds */}
            <div className="grid grid-cols-2 gap-3">
              {/* Wide top block */}
              <div className="relative col-span-2 h-48 overflow-hidden bg-brand-charcoal flex items-end p-6">
                {featured[0]?.images[0] && (
                  <Image src={featured[0].images[0]} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover opacity-50" unoptimized />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="relative z-10 font-heading text-3xl font-light text-white italic">
                  Bold. Authentic. African.
                </p>
              </div>
              {/* Bottom-left */}
              <div className="relative h-36 overflow-hidden bg-brand-terracotta flex items-end p-4">
                {featured[1]?.images[0] && (
                  <Image src={featured[1].images[0]} alt="" fill sizes="25vw" className="object-cover opacity-50" unoptimized />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="relative z-10">
                  <p className="font-heading text-2xl font-bold text-white">50+</p>
                  <p className="text-white/70 text-xs tracking-widest uppercase">Designs</p>
                </div>
              </div>
              {/* Bottom-right */}
              <div className="relative h-36 overflow-hidden bg-brand-sand flex items-end p-4">
                {featured[2]?.images[0] && (
                  <Image src={featured[2].images[0]} alt="" fill sizes="25vw" className="object-cover opacity-60" unoptimized />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="relative z-10">
                  <p className="font-heading text-2xl font-bold text-white">5★</p>
                  <p className="text-white/70 text-xs tracking-widest uppercase">Quality</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-brand-terracotta mb-4">
                Our Story
              </p>
              <h2 className="font-heading font-light text-4xl sm:text-5xl text-brand-charcoal leading-tight mb-6">
                Born in Nigeria,
                <br />
                <em className="font-medium">Styled for the World</em>
              </h2>
              <p className="text-brand-muted leading-relaxed mb-4 text-sm">
                At AIE Clothing Africa, fashion is more than fabric — it's a
                declaration. Every stitch honours the rich tapestry of African
                heritage while speaking a bold, contemporary language.
              </p>
              <p className="text-brand-muted leading-relaxed mb-8 text-sm">
                We source the finest Ankara prints and premium fabrics,
                partnering with skilled artisans to create pieces that feel as
                magnificent as they look.
              </p>
              <Link href="/about" className="btn-outline">
                Our Story <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA ── */}
      <section className="bg-brand-charcoal">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-brand-terracotta mb-4">
            Custom Orders
          </p>
          <h2 className="font-heading font-light text-4xl sm:text-5xl text-white mb-4">
            Have something in mind?
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            We take custom orders, aso-ebi sets, and bulk commissions. Chat with
            us directly on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${whatsapp}?text=Hello AIE Clothing! I'd like to place a custom order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand-charcoal hover:bg-brand-terracotta hover:text-white px-10 py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

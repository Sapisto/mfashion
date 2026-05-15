import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Package, RotateCcw, Shield } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductOptions } from "@/components/store/ProductOptions";
import type { Metadata } from "next";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347079727740";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug, { activeOnly: false });
  if (!product) return {};
  const desc = product.description.slice(0, 160);
  const image = product.images[0];
  return {
    title: `${product.name} — African Fashion`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      images: image ? [{ url: image, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://www.aieclothing.com/shop/${product.slug}`,
      seller: { "@type": "Organization", name: "AIE Clothing Africa" },
    },
    brand: { "@type": "Brand", name: "AIE Clothing Africa" },
  };

  return (
    <div className="bg-brand-cream overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-brand-muted mb-8 min-w-0 overflow-hidden">
          <Link
            href="/"
            className="hover:text-brand-terracotta transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/shop"
            className="hover:text-brand-terracotta transition-colors"
          >
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-brand-terracotta transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-brand-charcoal truncate min-w-0">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div>
            {product.category && (
              <p className="text-brand-muted text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                {product.category.name}
              </p>
            )}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal mb-3">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-brand-terracotta mb-6">
              {formatPrice(product.price)}
            </p>

            <p className="text-brand-muted leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size & Color + Add to cart */}
            <ProductOptions product={product} />

            {/* WhatsApp order */}
            <a
              href={`https://wa.me/${whatsapp}?text=Hello! I'd like to order the *${encodeURIComponent(product.name)}*. Is it available?`}
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
                  <p className="text-xs font-semibold text-brand-charcoal">
                    {label}
                  </p>
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
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

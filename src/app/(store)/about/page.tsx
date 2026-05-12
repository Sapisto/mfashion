import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind AIE Clothing Africa — born in Nigeria, styled for the world.",
};

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347079727740";

export default function AboutPage() {
  return (
    <div className="bg-brand-cream">

      {/* ── Hero ── */}
      <section className="bg-brand-charcoal text-white py-20 text-center">
        <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-brand-terracotta mb-4">
          Our Story
        </p>
        <h1 className="font-heading font-light text-4xl sm:text-5xl max-w-2xl mx-auto px-4">
          Born in Nigeria,
          <em className="font-medium text-brand-terracotta"> Styled for the World</em>
        </h1>
      </section>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-16">

        {/* ── Story ── */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Logo block instead of broken external image */}
          <div className="flex flex-col items-center justify-center bg-brand-sand h-96 gap-6">
            <div className="w-40 h-40 rounded-full overflow-hidden shrink-0">
              <Image
                src="/logo.jpeg"
                alt="AIE Clothing Africa"
                width={160}
                height={160}
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center">
              <p className="font-heading text-xl font-semibold text-brand-charcoal">
                AIE Clothing Africa
              </p>
              <p className="text-xs text-brand-muted tracking-widest uppercase mt-1">
                A Style for Everyone
              </p>
            </div>
          </div>

          <div className="space-y-4 text-brand-muted leading-relaxed text-sm">
            <p>
              AIE Clothing Africa was founded with a single belief: African fashion
              deserves to be celebrated on the world stage. We create garments that
              tell a story — of heritage, of pride, of bold, unapologetic beauty.
            </p>
            <p>
              Every piece in our collection is thoughtfully designed to honour the
              rich traditions of African textiles while speaking a contemporary,
              global language. From vibrant Ankara prints to elegant evening wear,
              we make clothes that command attention.
            </p>
            <p>
              We believe the best-dressed woman in the room is the one who wears her
              confidence. Our mission is to give you the garments that let that
              confidence shine.
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 text-center border-y border-brand-border py-10">
          {[
            { stat: "500+", label: "Happy Customers" },
            { stat: "50+", label: "Unique Designs" },
            { stat: "5★", label: "Quality Rating" },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-heading text-4xl font-light text-brand-terracotta">
                {item.stat}
              </p>
              <p className="text-[10px] text-brand-muted uppercase tracking-widest mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Values ── */}
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          {[
            {
              title: "Craftsmanship",
              body: "Every stitch matters. We work with skilled tailors to ensure each piece meets our exacting standards.",
            },
            {
              title: "Authenticity",
              body: "Genuine African prints and fabrics sourced from trusted suppliers. No shortcuts, no imitations.",
            },
            {
              title: "Empowerment",
              body: "Clothes that celebrate who you are. Designed for the woman who knows her worth.",
            },
          ].map((v) => (
            <div key={v.title} className="bg-brand-sand p-6">
              <h3 className="font-heading text-lg font-medium text-brand-charcoal mb-2">
                {v.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="text-center bg-brand-charcoal text-white p-10">
          <h2 className="font-heading font-light text-3xl sm:text-4xl mb-3">
            Ready to wear Africa&apos;s finest?
          </h2>
          <p className="text-white/50 mb-8 text-sm">
            Browse our collections or reach out on Instagram and WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="btn-primary">
              Shop Now
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white/30 text-white hover:bg-white hover:text-brand-charcoal"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href="https://www.instagram.com/aieclothingafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white/30 text-white hover:bg-white hover:text-brand-charcoal"
            >
              <InstagramIcon className="h-3.5 w-3.5" /> Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

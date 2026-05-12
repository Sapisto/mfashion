import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347079727740";

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-heading text-2xl font-bold mb-3">
              AIE <span className="text-brand-gold">Clothing Africa</span>
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Born in Nigeria, styled for the world. We create bold, authentic
              African fashion that celebrates culture and commands attention.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://www.instagram.com/aieclothingafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@aieclothingafrica.com"
                className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-semibold text-sm tracking-widest uppercase mb-4 text-gray-400">
              Shop
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/shop", label: "All Collections" },
                { href: "/shop?category=bubu-designs", label: "Bubu Designs" },
                { href: "/shop?category=asooke", label: "Asooke" },
                { href: "/shop?category=tops-and-short", label: "Tops and Short" },
                { href: "/shop?category=men-kaftan", label: "Men Kaftan" },
                { href: "/shop?category=ankara-and-asooke-jacket", label: "Ankara & Asooke Jacket" },
                { href: "/shop?category=tops-and-trousers", label: "Tops and Trousers" },
                { href: "/shop?category=asooke-patch-work", label: "Asooke Patch Work" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-400 hover:text-brand-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="font-semibold text-sm tracking-widest uppercase mb-4 text-gray-400">
              Help
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                {
                  href: `https://wa.me/${whatsapp}`,
                  label: "WhatsApp Order",
                  external: true,
                },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/returns-policy", label: "Returns Policy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-gray-400 hover:text-brand-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AIE Clothing Africa. All rights reserved.</p>
          <p>Made with ♥ in Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}

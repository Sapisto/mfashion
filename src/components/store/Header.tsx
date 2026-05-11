"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { CartButton } from "./CartButton";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=ankara-styles", label: "Ankara" },
  { href: "/shop?category=casual-wear", label: "Casual" },
  { href: "/shop?category=evening-wear", label: "Evening" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-cream border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Mobile menu */}
          <button
            className="md:hidden p-1 -ml-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="AIE Clothing Africa" width={40} height={40} />
            <span className="font-heading text-base font-semibold tracking-wide text-brand-charcoal hidden sm:block">
              AIE CLOTHING
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-medium tracking-[0.12em] uppercase text-brand-charcoal hover:text-brand-terracotta transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/shop" aria-label="Search" className="hover:text-brand-terracotta transition-colors">
              <Search className="h-4 w-4" />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-brand-border bg-brand-cream px-5 py-6">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-charcoal hover:text-brand-terracotta transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

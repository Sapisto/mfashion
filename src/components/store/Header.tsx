"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Menu, X, Search } from "lucide-react";

const CartButton = dynamic(
  () => import("./CartButton").then((m) => m.CartButton),
  { ssr: false, loading: () => <div className="w-9 h-9" /> }
);

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=bubu-designs", label: "Bubu" },
  { href: "/shop?category=asooke", label: "Asooke" },
  { href: "/shop?category=men-kaftan", label: "Men" },
  { href: "/about", label: "About" },
];

export function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-cream border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Mobile menu */}
          <button
            className="md:hidden p-1 -ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <Image src="/logo.jpeg" alt="AIE Clothing Africa" width={40} height={40} className="object-cover w-full h-full" />
            </div>
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
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:text-brand-terracotta transition-colors"
              aria-label="Search"
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
            <CartButton />
          </div>
        </div>

        {/* Search bar — slides down */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 px-4 py-2.5 border border-brand-border bg-white text-sm text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:border-brand-charcoal transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-charcoal hover:bg-brand-terracotta text-white text-xs font-semibold tracking-wide uppercase transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-brand-border bg-brand-cream px-5 py-6">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
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

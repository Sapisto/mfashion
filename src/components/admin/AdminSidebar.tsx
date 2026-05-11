"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="hidden md:flex flex-col w-56 bg-brand-charcoal text-white shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-heading text-lg font-bold">
          AIE <span className="text-brand-gold">Admin</span>
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors",
              isActive(href, exact)
                ? "bg-white/10 text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm transition-colors rounded-sm"
        >
          <ExternalLink className="h-4 w-4" />
          View Store
        </Link>
      </div>
    </aside>
  );
}

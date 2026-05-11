"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex">
      {TABS.map(({ href, icon: Icon, label, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-semibold tracking-wide transition-colors",
              active
                ? "text-brand-terracotta"
                : "text-gray-400 hover:text-gray-700"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "text-brand-terracotta")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

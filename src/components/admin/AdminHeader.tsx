"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/categories": "Categories",
};

function usePageTitle() {
  const pathname = usePathname();
  if (pathname.includes("/edit")) return "Edit Product";
  if (pathname.includes("/new")) return "Add Product";
  if (pathname.includes("/admin/orders/") && pathname !== "/admin/orders") return "Order Detail";
  return PAGE_TITLES[pathname] ?? "Admin";
}

export function AdminHeader({ user }: Props) {
  const title = usePageTitle();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Page title — visible on mobile */}
      <p className="font-semibold text-gray-900 text-sm md:hidden">{title}</p>

      {/* Spacer on desktop */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span className="hidden sm:block">{user?.name ?? user?.email}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  );
}

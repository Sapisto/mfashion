"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="h-4 w-4" />
        <span>{user?.name ?? user?.email}</span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </header>
  );
}

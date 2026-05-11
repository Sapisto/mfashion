import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={session.user} />
        {/* Extra bottom padding on mobile so content clears the tab bar */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <AdminMobileNav />
    </div>
  );
}

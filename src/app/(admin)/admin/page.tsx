import Link from "next/link";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
type RecentOrder = { id: string; customerName: string; total: number; status: string; items: { id: string }[]; createdAt: Date };

async function getStats() {
  const [orders, products, revenue] = await Promise.all([
    db.order.count(),
    db.product.count({ where: { isActive: true } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  const recentOrders = (await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  })) as RecentOrder[];

  return {
    totalOrders: orders,
    totalProducts: products,
    totalRevenue: revenue._sum.total ?? 0,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const { totalOrders, totalProducts, totalRevenue, recentOrders } =
    await getStats();

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Avg Order Value",
      value:
        totalOrders > 0
          ? formatPrice(totalRevenue / totalOrders)
          : "₦0",
      icon: TrendingUp,
      color: "text-brand-terracotta",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <div className={`inline-flex p-2.5 rounded-lg ${s.bg} mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded-lg p-5 transition-colors"
        >
          <Package className="h-6 w-6" />
          <div>
            <p className="font-semibold">Add New Product</p>
            <p className="text-white/75 text-xs mt-0.5">
              Upload photos and set pricing
            </p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 bg-brand-charcoal hover:bg-gray-800 text-white rounded-lg p-5 transition-colors"
        >
          <ShoppingCart className="h-6 w-6" />
          <div>
            <p className="font-semibold">View All Orders</p>
            <p className="text-white/75 text-xs mt-0.5">
              Manage and fulfil orders
            </p>
          </div>
        </Link>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-brand-terracotta hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {o.customerName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {o.items.length} item{o.items.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("en-NG")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(o.total)}
                  </p>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
        map[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

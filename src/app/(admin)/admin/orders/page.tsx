import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
type OrderRow = { id: string; customerName: string; customerEmail: string; total: number; status: string; paymentStatus: string; items: { id: string }[]; createdAt: Date };

export default async function AdminOrdersPage() {
  const orders = (await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })) as OrderRow[];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Payment</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{o.customerName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{o.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell text-xs">
                  {new Date(o.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {formatPrice(o.total)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <PaymentBadge status={o.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-xs text-brand-terracotta hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        map[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

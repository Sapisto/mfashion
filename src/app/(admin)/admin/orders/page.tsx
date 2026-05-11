import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

const PER_PAGE = 10;

type OrderRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  items: { id: string }[];
  createdAt: Date;
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [total, orders] = await Promise.all([
    db.order.count(),
    db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }) as unknown as Promise<OrderRow[]>,
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {total} total order{total !== 1 ? "s" : ""}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/orders?page=${page - 1}`}
                aria-disabled={page <= 1}
                className={`p-1.5 rounded border text-gray-600 transition-colors ${
                  page <= 1
                    ? "pointer-events-none opacity-40 border-gray-200"
                    : "border-gray-200 hover:border-brand-terracotta hover:text-brand-terracotta"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/orders?page=${p}`}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    p === page
                      ? "bg-brand-terracotta text-white border-brand-terracotta font-semibold"
                      : "border-gray-200 text-gray-600 hover:border-brand-terracotta hover:text-brand-terracotta"
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={`/admin/orders?page=${page + 1}`}
                aria-disabled={page >= totalPages}
                className={`p-1.5 rounded border text-gray-600 transition-colors ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40 border-gray-200"
                    : "border-gray-200 hover:border-brand-terracotta hover:text-brand-terracotta"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
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
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

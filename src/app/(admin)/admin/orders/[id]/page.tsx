import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import type { OrderItem } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const whatsapp = `https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(order.customerName)}! Your AIE Clothing order is ready. 🎉`;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-7">
        <Link
          href="/admin/orders"
          className="p-2 rounded-sm border border-gray-200 hover:border-brand-terracotta hover:text-brand-terracotta transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Detail</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            #{order.id.slice(-8).toUpperCase()} ·{" "}
            {new Date(order.createdAt).toLocaleString("en-NG")}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Order Status
              </p>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Payment
              </p>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Name" value={order.customerName} />
            <Info label="Email" value={order.customerEmail} />
            <Info label="Phone" value={order.customerPhone} />
            <Info label="City / State" value={`${order.city}, ${order.state}`} />
            <Info label="Address" value={order.address} className="sm:col-span-2" />
            {order.notes && (
              <Info label="Notes" value={order.notes} className="sm:col-span-2" />
            )}
          </div>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-sm text-sm font-semibold transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Message Customer
          </a>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {(order.items as unknown as OrderItem[]).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 text-sm py-2.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  {(item.size || item.color) && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-lg text-brand-terracotta">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const COLORS: Record<string, string> = {
  PENDING: "text-yellow-700 bg-yellow-50",
  PROCESSING: "text-blue-700 bg-blue-50",
  SHIPPED: "text-purple-700 bg-purple-50",
  DELIVERED: "text-green-700 bg-green-50",
  CANCELLED: "text-red-700 bg-red-50",
};

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  async function handleChange(next: string) {
    const prev = status;
    setStatus(next);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Order status updated");
      router.refresh();
    } catch {
      setStatus(prev);
      toast.error("Could not update status");
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-[11px] font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-terracotta ${
        COLORS[status] ?? "text-gray-700 bg-gray-50"
      }`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const BADGE: Record<string, string> = {
  PENDING:    "text-yellow-700 bg-yellow-50 border-yellow-100",
  PROCESSING: "text-blue-700   bg-blue-50   border-blue-100",
  SHIPPED:    "text-purple-700 bg-purple-50 border-purple-100",
  DELIVERED:  "text-green-700  bg-green-50  border-green-100",
  CANCELLED:  "text-red-700    bg-red-50    border-red-100",
};

const DOT: Record<string, string> = {
  PENDING:    "bg-yellow-400",
  PROCESSING: "bg-blue-400",
  SHIPPED:    "bg-purple-400",
  DELIVERED:  "bg-green-400",
  CANCELLED:  "bg-red-400",
};

function label(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  async function handleChange(next: string | null) {
    if (!next) return;
    const prev = status;
    setStatus(next);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status updated");
      router.refresh();
    } catch {
      setStatus(prev);
      toast.error("Could not update status");
    }
  }

  return (
    <SelectPrimitive.Root value={status} onValueChange={(val) => { if (val) handleChange(val); }}>
      {/* Trigger — compact coloured badge */}
      <SelectPrimitive.Trigger
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer",
          "focus:outline-none transition-all duration-150",
          BADGE[status] ?? "text-gray-700 bg-gray-50 border-gray-100"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", DOT[status] ?? "bg-gray-400")} />
        {label(status)}
        <ChevronDown className="h-3 w-3 opacity-50" />
      </SelectPrimitive.Trigger>

      {/* Dropdown */}
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={6} className="z-50">
          <SelectPrimitive.Popup className="bg-white rounded-xl shadow-xl ring-1 ring-black/10 py-1.5 min-w-44 origin-(--transform-origin) duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <SelectPrimitive.List>
              {STATUSES.map((s) => (
                <SelectPrimitive.Item
                  key={s}
                  value={s}
                  className="flex items-center gap-2.5 px-3 py-2 mx-1 rounded-lg cursor-default w-[calc(100%-0.5rem)] focus:bg-gray-50 focus:outline-none transition-colors"
                >
                  <span className={cn("h-2 w-2 rounded-full shrink-0", DOT[s])} />
                  <SelectPrimitive.ItemText className="flex-1 text-sm font-medium text-gray-700">
                    {label(s)}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-3.5 w-3.5 text-brand-terracotta" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

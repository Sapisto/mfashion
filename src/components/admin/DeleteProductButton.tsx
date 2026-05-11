"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`${name} deleted`);
      router.refresh();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[10px] font-semibold bg-red-500 text-white px-2 py-1 rounded-sm hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading ? "…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
      aria-label="Delete product"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

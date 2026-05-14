"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Props {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`${name} deleted`);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete product"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${name}"?`}
        description="This product will be hidden from the store. This cannot be undone."
        confirmLabel="Delete product"
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}

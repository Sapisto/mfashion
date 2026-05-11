"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface Cat {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function CategoryManager({ initialCategories }: { initialCategories: Cat[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slugify(name.trim()) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCategories((prev) => [...prev, { ...json, _count: { products: 0 } }]);
      setName("");
      toast.success("Category created");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, catName: string) {
    if (!confirm(`Delete "${catName}"? Products won't be deleted.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete category");
    }
  }

  return (
    <div className="max-w-lg space-y-5">
      {/* Add new */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Add Category</h2>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name…"
            className="admin-input flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !name.trim()}
            className="px-4 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-60 text-white rounded-sm text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-50">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-medium text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {c._count.products} product{c._count.products !== 1 ? "s" : ""} · /{c.slug}
              </p>
            </div>
            <button
              onClick={() => handleDelete(c.id, c.name)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              disabled={c._count.products > 0}
              title={c._count.products > 0 ? "Remove products first" : "Delete"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-sm">
            No categories yet.
          </div>
        )}
      </div>
    </div>
  );
}

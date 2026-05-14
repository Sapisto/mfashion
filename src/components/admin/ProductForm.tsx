"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import type { Category } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  categories: Pick<Category, "id" | "name">[];
  defaultValues?: Partial<FormData> & {
    id?: string;
    images?: string[];
    sizes?: string[];
    colors?: string[];
  };
}

export function ProductForm({ categories, defaultValues }: Props) {
  const router = useRouter();
  const isEditing = !!defaultValues?.id;

  const [images, setImages] = useState<string[]>(defaultValues?.images ?? []);
  const [sizes, setSizes] = useState<string[]>(defaultValues?.sizes ?? []);
  const [colors, setColors] = useState<string[]>(defaultValues?.colors ?? []);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setImages((prev) => [...prev, json.url]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl() {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    const payload = {
      ...data,
      images,
      sizes,
      colors,
      categoryId: data.categoryId || null,
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${defaultValues!.id}`
        : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success(isEditing ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 max-w-3xl">
      {/* Basic info */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Product Details</h2>

        <div>
          <label className="admin-label">Product Name</label>
          <input {...register("name")} className="admin-input" placeholder="Ankara Wrap Dress" />
          {errors.name && <p className="admin-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="admin-label">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="admin-input resize-none"
            placeholder="Describe the product in detail…"
          />
          {errors.description && (
            <p className="admin-error">{errors.description.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="admin-label">Price (₦)</label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              className="admin-input"
              placeholder="15000"
            />
            {errors.price && (
              <p className="admin-error">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="admin-label">Stock</label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              className="admin-input"
              placeholder="10"
            />
          </div>
          <div>
            <label className="admin-label">Category</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="h-10 rounded-sm border-gray-200">
                    <SelectValue placeholder="— None —" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">— None —</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 accent-brand-terracotta"
            />
            <span className="text-gray-700">Featured (show on home page)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-4 h-4 accent-brand-terracotta"
            />
            <span className="text-gray-700">Active (visible in store)</span>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Product Images</h2>

        {/* Existing images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div
                key={i}
                className="relative w-20 aspect-[3/4] rounded-sm overflow-hidden bg-brand-sand border border-gray-200"
              >
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File upload */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                Array.from(e.target.files ?? []).forEach(uploadFile);
                e.target.value = "";
              }}
            />
            <span className="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-sm text-sm text-gray-600 hover:border-brand-terracotta hover:text-brand-terracotta transition-colors">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Upload from device"}
            </span>
          </label>
        </div>

        {/* Or URL */}
        <div className="flex gap-2">
          <input
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="Or paste an image URL…"
            className="admin-input flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImageUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="px-4 py-2.5 border border-gray-200 rounded-sm text-sm hover:border-brand-terracotta hover:text-brand-terracotta transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Sizes */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Sizes</h2>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-sm text-sm"
            >
              {s}
              <button
                type="button"
                onClick={() => setSizes((prev) => prev.filter((x) => x !== s))}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="XS, S, M, L, XL, custom…"
            className="admin-input flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (sizeInput.trim()) {
                  setSizes((prev) => [...prev, sizeInput.trim()]);
                  setSizeInput("");
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (sizeInput.trim()) {
                setSizes((prev) => [...prev, sizeInput.trim()]);
                setSizeInput("");
              }
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-sm text-sm hover:border-brand-terracotta hover:text-brand-terracotta transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Colors */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Colors / Variants</h2>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-sm text-sm"
            >
              {c}
              <button
                type="button"
                onClick={() => setColors((prev) => prev.filter((x) => x !== c))}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Red, Blue, Gold Ankara…"
            className="admin-input flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (colorInput.trim()) {
                  setColors((prev) => [...prev, colorInput.trim()]);
                  setColorInput("");
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (colorInput.trim()) {
                setColors((prev) => [...prev, colorInput.trim()]);
                setColorInput("");
              }
            }}
            className="px-4 py-2.5 border border-gray-200 rounded-sm text-sm hover:border-brand-terracotta hover:text-brand-terracotta transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-60 text-white px-8 py-3 rounded-sm font-semibold text-sm transition-colors"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

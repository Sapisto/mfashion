import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Fill in the details below to list a new piece.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}

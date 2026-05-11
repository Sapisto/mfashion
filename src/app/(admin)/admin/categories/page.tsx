import { db } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Manage product categories
        </p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}

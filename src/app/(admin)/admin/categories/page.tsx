import { getCategoriesWithCount } from "@/lib/data/categories";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCount();

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

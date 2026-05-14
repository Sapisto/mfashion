import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-0.5">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        defaultValues={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId ?? undefined,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          images: product.images,
          sizes: product.sizes,
          colors: product.colors,
        }}
      />
    </div>
  );
}

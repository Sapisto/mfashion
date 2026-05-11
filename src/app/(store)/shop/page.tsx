import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "@/components/store/ShopFilters";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    featured?: string;
    q?: string;
  }>;
}

async function getProducts(params: Awaited<Props["searchParams"]>): Promise<Product[]> {
  const where: Record<string, unknown> = { isActive: true };

  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.featured === "true") {
    where.isFeatured = true;
  }
  if (params.q) {
    where.name = { contains: params.q, mode: "insensitive" };
  }

  const orderBy: Record<string, string> =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  return db.product.findMany({
    where,
    include: { category: true },
    orderBy,
  }) as unknown as Promise<Product[]>;
}

async function getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  return db.category.findMany({ orderBy: { name: "asc" } }) as Promise<{ id: string; name: string; slug: string }[]>;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const activeCategory = params.category ?? "";
  const activeSort = params.sort ?? "newest";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal">
          {params.category
            ? categories.find((c) => c.slug === params.category)?.name ??
              "Collection"
            : params.featured === "true"
            ? "New Arrivals"
            : "All Collections"}
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          {products.length} piece{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <ShopFilters
            categories={categories}
            activeCategory={activeCategory}
            activeSort={activeSort}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-brand-muted text-lg">No pieces found.</p>
              <a
                href="/shop"
                className="mt-4 inline-block text-brand-terracotta hover:underline text-sm font-medium"
              >
                Clear filters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

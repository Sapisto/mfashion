import { db } from "@/lib/db";
import type { Product } from "@/types";

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return (await db.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    })) as unknown as Product[];
  } catch {
    return [];
  }
}

export interface ProductFilters {
  category?: string;
  sort?: string;
  featured?: string;
  q?: string;
}

export async function getProducts(params: ProductFilters): Promise<Product[]> {
  const where: Record<string, unknown> = { isActive: true };

  if (params.category) where.category = { slug: params.category };
  if (params.featured === "true") where.isFeatured = true;
  if (params.q) where.name = { contains: params.q, mode: "insensitive" };

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

export async function getProductBySlug(
  slug: string,
  { activeOnly = true }: { activeOnly?: boolean } = {}
): Promise<Product | null> {
  return db.product.findUnique({
    where: { slug, ...(activeOnly ? { isActive: true } : {}) },
    include: { category: true },
  }) as unknown as Promise<Product | null>;
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string
): Promise<Product[]> {
  return db.product.findMany({
    where: {
      isActive: true,
      categoryId,
      NOT: { id: excludeId },
    },
    include: { category: true },
    take: 4,
  }) as unknown as Promise<Product[]>;
}

export async function getProductById(id: string) {
  return db.product.findUnique({ where: { id } });
}

export async function getPaginatedProducts(page: number, perPage: number) {
  const [total, products] = await Promise.all([
    db.product.count(),
    db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return { total, products };
}

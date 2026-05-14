import { db } from "@/lib/db";

const FALLBACK_COLORS = ["#b5622a", "#111111", "#c9973e", "#3d2b1f"];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "tops-and-short": "Chic tops paired with matching shorts",
  "asooke-patch-work": "Bold Asooke artistry, reimagined",
  "bubu-designs": "Comfort, elegance and African flair",
  "men-kaftan": "Refined kaftans for the modern man",
  "asooke": "Premium handwoven Asooke fabric",
  "tops-and-trousers": "Coordinated sets for every occasion",
  "ankara-and-asooke-jacket": "Statement jackets — bold and proud",
};

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoriesWithCount() {
  return db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoriesWithImages() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    take: 4,
  });

  return Promise.all(
    categories.map(async (cat, i) => {
      const product = await db.product.findFirst({
        where: { categoryId: cat.id, isActive: true },
        select: { images: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: CATEGORY_DESCRIPTIONS[cat.slug] ?? "Explore the collection",
        image: (product?.images ?? []).length > 0 ? product!.images[0] : null,
        fallback: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      };
    })
  );
}

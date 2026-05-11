import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter });

async function main() {
  // ── Ensure categories exist ──────────────────────────────────────────────
  const ankara = await db.category.upsert({
    where: { slug: "ankara-styles" },
    update: {},
    create: { name: "Ankara Styles", slug: "ankara-styles" },
  });

  const evening = await db.category.upsert({
    where: { slug: "evening-wear" },
    update: {},
    create: { name: "Evening Wear", slug: "evening-wear" },
  });

  // ── Products ──────────────────────────────────────────────────────────────
  const products = [
    {
      name: "Multicolour Striped Kaftan Bubu",
      slug: "multicolour-striped-kaftan-bubu",
      description:
        "A bold, eye-catching kaftan crafted from vibrant striped fabric in red, yellow, green, navy and white. The flowing silhouette offers effortless elegance — perfect for parties, owambe events and special occasions. Available in all sizes.",
      price: 35000,
      stock: 10,
      categoryId: ankara.id,
      isFeatured: true,
      isActive: true,
      images: [] as string[],
      sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
      colors: ["Multicolour"],
    },
    {
      name: "Green Ankara Jacket & Yellow Aso-Oke Short Set",
      slug: "green-ankara-jacket-yellow-aso-oke-set",
      description:
        "A stunning two-piece set featuring a deep green Ankara print jacket paired with a bright yellow aso-oke mini dress. Bold colour contrast, clean lines and effortless confidence. DM or WhatsApp to book.",
      price: 28000,
      stock: 8,
      categoryId: ankara.id,
      isFeatured: true,
      isActive: true,
      images: [] as string[],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Green & Yellow"],
    },
    {
      name: "Red Ankara Peplum Short Dress",
      slug: "red-ankara-peplum-short-dress",
      description:
        "A fiery red Ankara peplum dress with a keyhole neckline and flared skirt. Rich print, flattering fit — this piece turns heads at every event. Available in all sizes.",
      price: 22000,
      stock: 12,
      categoryId: ankara.id,
      isFeatured: true,
      isActive: true,
      images: [] as string[],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Red & Black"],
    },
    {
      name: "Elegance Bubu — Yellow & Black Print",
      slug: "elegance-bubu-yellow-black-print",
      description:
        "Elegance made just for you. ✨ This beautifully crafted bubu brings comfort, class and confidence together in one timeless piece. Rich yellow, black and orange Ankara print with intricate detailing throughout. Perfect for formal events and celebrations.",
      price: 40000,
      stock: 6,
      categoryId: evening.id,
      isFeatured: true,
      isActive: true,
      images: [] as string[],
      sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
      colors: ["Yellow & Black"],
    },
  ];

  for (const product of products) {
    const existing = await db.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      console.log(`⏭  Skipped (already exists): ${product.name}`);
      continue;
    }

    await db.product.create({ data: product });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log("\n🎉 Done! Add photos by going to /admin/products and clicking Edit on each product.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());

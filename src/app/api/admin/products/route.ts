import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, price, stock, categoryId, isFeatured, isActive, images, sizes, colors } = body;

  if (!name || !description || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock: stock ?? 0,
      categoryId: categoryId || null,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
      images: images ?? [],
      sizes: sizes ?? [],
      colors: colors ?? [],
    },
  });

  return NextResponse.json(product, { status: 201 });
}

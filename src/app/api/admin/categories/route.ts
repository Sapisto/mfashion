import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug } = await req.json();

  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }

  const category = await db.category.create({ data: { name, slug } });
  return NextResponse.json(category, { status: 201 });
}

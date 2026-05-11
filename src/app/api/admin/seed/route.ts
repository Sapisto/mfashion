import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// One-time setup route — disable after first use or protect with env var
export async function POST(req: Request) {
  const secret = req.headers.get("x-setup-secret");
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { email, password, name } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }

  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await db.admin.create({
    data: { email, passwordHash, name: name ?? "Admin" },
  });

  return NextResponse.json({ id: admin.id, email: admin.email });
}

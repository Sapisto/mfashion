import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin, BUCKET_NAME } from "@/lib/supabase";
import { nanoid } from "nanoid";

// nanoid is not installed — use crypto.randomUUID instead
function uniqueId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${uniqueId()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return NextResponse.json({ url: urlData.publicUrl });
}

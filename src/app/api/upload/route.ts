import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin, BUCKET_NAME } from "@/lib/supabase";
import sharp from "sharp";

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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Convert and compress to JPEG regardless of input format
  // This handles iPhone HEIC, PNG, JPEG — everything becomes a small web-ready JPEG
  const compressed = await sharp(buffer)
    .rotate()             // auto-rotate based on EXIF orientation
    .resize(1200, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  const path = `products/${uniqueId()}.jpg`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, compressed, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return NextResponse.json({ url: urlData.publicUrl });
}

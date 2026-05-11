import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Used server-side only (image uploads, etc.)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const BUCKET_NAME = "product-images";

export async function deleteImage(url: string): Promise<void> {
  const path = url.split(`${BUCKET_NAME}/`)[1];
  if (!path) return;
  await supabaseAdmin.storage.from(BUCKET_NAME).remove([path]);
}

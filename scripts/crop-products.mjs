/**
 * Crops the iPhone screenshots to just the product/model area.
 * Place the raw screenshots in public/products/raw/ and run:
 *   node scripts/crop-products.mjs
 */

import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const RAW_DIR = "public/products/raw";
const OUT_DIR = "public/products";

if (!existsSync(RAW_DIR)) {
  console.log(`❌  Folder not found: ${RAW_DIR}`);
  console.log(`    Create it and drop your screenshots inside, then run this script again.`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(RAW_DIR).filter((f) =>
  /\.(jpg|jpeg|png|webp|heic)$/i.test(f)
);

if (files.length === 0) {
  console.log(`❌  No images found in ${RAW_DIR}`);
  process.exit(1);
}

for (const file of files) {
  const inputPath = join(RAW_DIR, file);
  const outputName = file.replace(/\.(heic|jpeg|jpg|png|webp)$/i, ".jpg");
  const outputPath = join(OUT_DIR, outputName);

  const image = sharp(inputPath);
  const meta = await image.metadata();

  const { width, height } = meta;

  // iPhone screenshots have the status bar (~120px) and bottom bar (~200px).
  // The product is typically centered between these.
  // We crop: top 15% off (status bar + caption), bottom 12% off (nav bar + likes row).
  const topCrop = Math.round(height * 0.15);
  const bottomCrop = Math.round(height * 0.12);
  const cropHeight = height - topCrop - bottomCrop;

  // Also trim the horizontal IG UI padding — the photo fills the full width usually.
  await image
    .extract({ left: 0, top: topCrop, width, height: cropHeight })
    .resize({ width: 800, height: 1067, fit: "cover", position: "top" }) // standard 3:4 product ratio
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log(`✅  Cropped: ${file} → ${outputName}`);
}

console.log(`\n🎉  Done! Cropped images saved to: ${OUT_DIR}`);
console.log(`    Upload them at /admin/products → Edit each product.`);

import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const SRC = "C:/Users/HP/Downloads/assets/asset 1";
const OUT = "public/assets/images/teeth";
const manifestPath = "src/assets-manifest.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
for (let i = 1; i <= 6; i++) {
  const input = `${SRC}/tooth ${i}.jpg`;
  const name = `teeth/tooth-${i}`;
  // Build an alpha mask from brightness (dark bg -> transparent, tooth -> opaque)
  const base = sharp(input).resize({ width: 512 });
  const rgb = await base.clone().removeAlpha().toBuffer();
  const mask = await sharp(input).resize({ width: 512 }).grayscale()
    .linear(3.0, -220).blur(0.6).toColourspace("b-w").toBuffer(); // steep contrast mask
  for (const ext of ["webp", "avif"]) {
    const buf = await sharp(rgb).ensureAlpha().joinChannel(mask)
      [ext]({ quality: 78, ...(ext === "avif" ? {} : {}) }).toBuffer();
    writeFileSync(resolve(OUT, `tooth-${i}-512.${ext}`), buf);
  }
  // tiny lqip (opaque fine)
  const lqip = await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  manifest.images[name] = { widths: [512], ratio: 1, lqip: `data:image/webp;base64,${lqip.toString("base64")}` };
  console.log("✓ transparent", name);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log("updated manifest");

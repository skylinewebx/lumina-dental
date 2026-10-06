import sharp from "sharp";
import { existsSync } from "node:fs";
const W=1200,H=630;
// Deep navy gradient background with a teal glow
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b121d"/><stop offset="1" stop-color="#070b12"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="45%" r="55%">
      <stop offset="0" stop-color="#3FD0C0" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#3FD0C0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#b)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="90" y="300" font-family="Georgia, serif" font-size="78" fill="#eef3f6">Lumina Dental Care</text>
  <text x="92" y="360" font-family="Arial, sans-serif" font-size="30" fill="#9ff5e6">Dentistry that feels like light.</text>
</svg>`);
let img = sharp(bg);
// Composite the glossy tooth image on the right if available
const tooth = "public/assets/images/hero-tooth-1200.webp";
const layers = [];
if (existsSync(tooth)) {
  const t = await sharp(tooth).resize(560,560,{fit:"cover"}).png().toBuffer();
  layers.push({ input: t, left: W-540, top: 35 });
}
await img.composite(layers).jpeg({quality:82}).toFile("public/assets/images/og-image.jpg");
console.log("wrote public/assets/images/og-image.jpg");

/* =============================================================================
   MEDIA OPTIMISATION PIPELINE
   Reads the raw files from the user's "assets" folder and produces small,
   web-friendly media in /public/assets, plus src/assets-manifest.json.
     • Images → AVIF + WebP at several widths + tiny blur-up placeholder
     • Videos → H.264 MP4 + VP9 WebM, desktop + mobile, no audio, +faststart,
                WebP poster frame
   Run with:  npm run media
   ========================================================================== */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ffmpeg = (await import("@ffmpeg-installer/ffmpeg")).default.path;
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = "C:/Users/HP/Downloads/assets"; // the user's dragged-in assets folder

const IMG_OUT = resolve(ROOT, "public/assets/images");
const VID_OUT = resolve(ROOT, "public/assets/videos");
for (const d of [IMG_OUT, resolve(IMG_OUT, "treatments"), resolve(IMG_OUT, "teeth"), resolve(IMG_OUT, "fx"), VID_OUT])
  mkdirSync(d, { recursive: true });

const manifest = { images: {}, videos: {} };

async function image(srcFile, name, { widths, ratio = null } = {}) {
  const input = resolve(SRC, srcFile);
  if (!existsSync(input)) { console.warn("! missing", srcFile); return; }
  const meta = await sharp(input).metadata();
  const use = widths.filter((w) => w <= meta.width); if (!use.length) use.push(meta.width);
  for (const w of use) {
    let p = sharp(input);
    if (ratio) p = p.resize({ width: w, height: Math.round(w / ratio), fit: "cover" });
    else p = p.resize({ width: w });
    await p.clone().avif({ quality: 52 }).toFile(resolve(IMG_OUT, `${name}-${w}.avif`));
    await p.clone().webp({ quality: 74 }).toFile(resolve(IMG_OUT, `${name}-${w}.webp`));
  }
  const lqipBuf = await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  manifest.images[name] = {
    widths: use, ratio: ratio || +(meta.width / meta.height).toFixed(4),
    lqip: `data:image/webp;base64,${lqipBuf.toString("base64")}`,
  };
  console.log(`✓ img ${name} [${use.join(",")}]`);
}

function ff(args) { execFileSync(ffmpeg, args, { stdio: ["ignore", "ignore", "ignore"] }); }
async function video(srcFile, name) {
  const input = resolve(SRC, srcFile);
  if (!existsSync(input)) { console.warn("! missing", srcFile); return; }
  const variants = [
    { suffix: "desktop", scale: "1280:-2", crf: 28 },
    { suffix: "mobile", scale: "854:-2", crf: 30 },
  ];
  for (const v of variants) {
    ff(["-y", "-i", input, "-an", "-vf", `scale=${v.scale}`, "-c:v", "libx264", "-crf", String(v.crf),
      "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      resolve(VID_OUT, `${name}-${v.suffix}.mp4`)]);
    ff(["-y", "-i", input, "-an", "-vf", `scale=${v.scale}`, "-c:v", "libvpx-vp9", "-crf", String(v.crf + 4),
      "-b:v", "0", "-row-mt", "1", resolve(VID_OUT, `${name}-${v.suffix}.webm`)]);
  }
  const framePng = resolve(VID_OUT, `${name}-frame.png`);
  ff(["-y", "-ss", "1", "-i", input, "-frames:v", "1", framePng]);
  await sharp(framePng).resize({ width: 1280 }).webp({ quality: 66 }).toFile(resolve(VID_OUT, `${name}-poster.webp`));
  const { unlinkSync } = await import("node:fs");
  unlinkSync(framePng);
  console.log(`✓ vid ${name} (desktop+mobile mp4/webm + poster)`);
}

console.log("Optimising from:", SRC, "\n");

/* Treatment photos (4:3) */
const T = [["cosmetic", "cosmetic.jpg"], ["crowns", "crowns.jpg"], ["emergency", "emergency.jpg"],
  ["implants", "implants.jpg"], ["orthodontics", "orthodontics.jpg"], ["pediatric", "pediatric.jpg"],
  ["preventive", "preventive.jpg"], ["root-canal", "root-cana.jpg"]];
for (const [name, file] of T) await image(file, `treatments/${name}`, { widths: [480, 800, 1200], ratio: 2400 / 1792 });

/* Falling-tooth images (glossy tooth on dark; used with screen-blend) */
for (let i = 1; i <= 6; i++) await image(`asset 1/tooth ${i}.jpg`, `teeth/tooth-${i}`, { widths: [320, 560] });

/* Teal particle overlay */
await image("assets 8.jpg", "fx/particles", { widths: [1024, 1600] });

/* Doctor full-body portraits (3:4) */
await image("Male_dentist_smiling_in_studio_2K_20261006020226.jpg", "doctor-james", { widths: [300, 600, 1000, 1400], ratio: 3 / 4 });
await image("Female_dentist_standing_and_smiling_2K_20261006020317.jpg", "doctor-emily", { widths: [300, 600, 1000, 1400], ratio: 3 / 4 });
await image("Female_dentist_standing_with_smile_2K_20261006020337.jpg", "doctor-sophia", { widths: [300, 600, 1000, 1400], ratio: 3 / 4 });

/* Share image (og) from the glowing-tooth render → 1200x630 */
await sharp(resolve(SRC, "assets 10.jpg")).resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82 }).toFile(resolve(IMG_OUT, "og-image.jpg"));
console.log("✓ og-image.jpg (1200x630)");

/* Videos */
await video("asset 3.mp4", "hero-scene");        // tooth/island/ocean/sunset behind the 3D tooth
await video("assets 2.mp4", "teeth-fall");       // falling teeth loop (hero)
await video("Dental_clinic_interior_camera_drift_20261006043704.mp4", "doctors-loop"); // doctors ambience

writeFileSync(resolve(ROOT, "src/assets-manifest.json"), JSON.stringify(manifest, null, 2));
console.log("\n✓ wrote src/assets-manifest.json\nDone.");

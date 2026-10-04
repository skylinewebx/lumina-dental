/* =============================================================================
   MEDIA OPTIMISATION PIPELINE
   Reads the raw assets from the "Lumina Dental" folder and produces small,
   web-friendly files in /public/assets:
     • Images  → AVIF + WebP at several widths + a tiny blur-up placeholder
     • Videos  → H.264 MP4 + VP9 WebM, desktop (720p) + mobile (480p), no audio,
                 +faststart, plus a WebP poster frame
   It also writes src/assets-manifest.json (widths + LQIP data URIs) consumed
   by the site. Re-run any time with:  npm run media
   ========================================================================== */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ffmpeg = (await import("@ffmpeg-installer/ffmpeg")).default.path;
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Raw source folders (sit next to the project in Downloads).
const SRC = resolve(ROOT, "..", "Lumina Dental");
const IMAGES = resolve(ROOT, "..", "images"); // extra images (doctor photos)
const IMG_OUT = resolve(ROOT, "public/assets/images");
const VID_OUT = resolve(ROOT, "public/assets/videos");
mkdirSync(IMG_OUT, { recursive: true });
mkdirSync(VID_OUT, { recursive: true });

const IMG_WIDTHS = [480, 800, 1200, 1800];
const manifest = { images: {}, videos: {} };

/* ---- Images -------------------------------------------------------------- */
async function processImage(srcFile, name, { widths = IMG_WIDTHS, square = false, srcDir = SRC } = {}) {
  const input = resolve(srcDir, srcFile);
  if (!existsSync(input)) { console.warn("! missing", srcFile); return; }

  const meta = await sharp(input).metadata();
  const maxW = square ? Math.min(meta.width, 1024) : meta.width;
  const useWidths = widths.filter((w) => w <= maxW);
  if (!useWidths.length) useWidths.push(maxW);

  for (const w of useWidths) {
    const base = sharp(input).resize({ width: w, height: square ? w : undefined, fit: "cover" });
    await base.clone().avif({ quality: 50 }).toFile(resolve(IMG_OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(resolve(IMG_OUT, `${name}-${w}.webp`));
  }

  // Tiny blurred LQIP (inline data URI, ~20px wide).
  const lqipBuf = await sharp(input).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuf.toString("base64")}`;

  manifest.images[name] = {
    widths: useWidths,
    ratio: +(meta.width / meta.height).toFixed(4),
    lqip,
  };
  console.log(`✓ image ${name}  [${useWidths.join(", ")}]  ratio ${(meta.width / meta.height).toFixed(2)}`);
}

/* ---- Videos -------------------------------------------------------------- */
function ff(args) { execFileSync(ffmpeg, args, { stdio: ["ignore", "ignore", "ignore"] }); }

async function processVideo(srcFile, name) {
  const input = resolve(SRC, srcFile);
  if (!existsSync(input)) { console.warn("! missing", srcFile); return; }

  const variants = [
    { suffix: "desktop", scale: "1280:-2", crf: 28, vbMax: "1600k" },
    { suffix: "mobile",  scale: "854:-2",  crf: 30, vbMax: "900k" },
  ];

  for (const v of variants) {
    // H.264 MP4 (broad support, faststart for streaming start)
    ff(["-y", "-i", input, "-an", "-vf", `scale=${v.scale}`, "-c:v", "libx264",
        "-crf", String(v.crf), "-preset", "slow", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", resolve(VID_OUT, `${name}-${v.suffix}.mp4`)]);
    // VP9 WebM (smaller where supported)
    ff(["-y", "-i", input, "-an", "-vf", `scale=${v.scale}`, "-c:v", "libvpx-vp9",
        "-crf", String(v.crf + 4), "-b:v", "0", "-row-mt", "1",
        resolve(VID_OUT, `${name}-${v.suffix}.webm`)]);
  }

  // Poster frame (first good frame) → WebP.
  const framePng = resolve(VID_OUT, `${name}-frame.png`);
  ff(["-y", "-ss", "0.5", "-i", input, "-frames:v", "1", framePng]);
  await sharp(framePng).resize({ width: 1280 }).webp({ quality: 68 })
    .toFile(resolve(VID_OUT, `${name}-poster.webp`));
  // small LQIP for the video box too
  const lqipBuf = await sharp(framePng).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const { unlinkSync } = await import("node:fs");
  unlinkSync(framePng);

  manifest.videos[name] = { lqip: `data:image/webp;base64,${lqipBuf.toString("base64")}` };
  console.log(`✓ video ${name}  (desktop+mobile mp4/webm + poster)`);
}

/* ---- Run ----------------------------------------------------------------- */
console.log("Optimising media from:", SRC, "\n");
await processImage("IMAGE A.jpg", "hero-tooth");                 // hero poster / LCP
await processImage("IMAGE B (2).jpg", "clinic-reception");       // studio gallery
await processImage("IMAGE C (2).jpg", "clinic-room");            // studio gallery
// Doctor portraits (from the "images" folder) — square crops.
const DOC = { square: true, widths: [400, 800], srcDir: IMAGES };
await processImage("Dr. Nisha Kapoor.jpg", "doctor-emily", DOC);   // Dr. Emily Carter
await processImage("Dr. Rohan Verma.jpg", "doctor-james", DOC);    // Dr. James Whitaker
await processImage("Dr. Sara Pinto.jpg", "doctor-sophia", DOC);    // Dr. Sophia Bennett
await processVideo("VIDEO E.mp4", "hero-bg");                    // hero ambient loop
await processVideo("VIDEO F.mp4", "tooth-spin");                 // craft showcase

writeFileSync(resolve(ROOT, "src/assets-manifest.json"), JSON.stringify(manifest, null, 2));
console.log("\n✓ wrote src/assets-manifest.json");
console.log("Done.");

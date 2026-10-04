# Lumina Dental Care — Asset Guide

Until your real media arrives, the site uses tasteful placeholders:
- **Hero 3D tooth** — a glossy procedural tooth built in Three.js (no file needed).
- **Doctor photos** — elegant initials on a gradient avatar.
- **Map** — a live Google Maps iframe (sample location).

Every asset path lives in **`src/config.js`** under `assets` and `hero3d`, so you
swap files by editing that one file. Drop files into the folders named below.

**Format:** prefer **WebP** for images (smaller, sharp) and **MP4 (H.264)** for
video. Keep the whole set to one consistent brand look — deep navy-and-teal,
premium, photorealistic, soft studio light, no text / logos / watermarks — so it
reads as a single shoot. When your files arrive, the site adapts to their real
ratio and applies clip-path reveal on scroll, gentle zoom on hover, and lazy-load.

**Nothing here is required** — the site is fully polished with placeholders. All
assets below are **optional** upgrades; the only one that changes behaviour is the
`.glb` (swaps the procedural tooth for a real model).

| Asset | Where used | Required? |
|---|---|---|
| A. Hero poster | Fallback if you add a hero video | Optional |
| B/C. Clinic photos | Future gallery / background accents | Optional |
| D. Doctor portraits | Doctors section (replaces initials) | Optional |
| E. Hero background loop | Ambient layer behind the 3D tooth | Optional |
| F. Tooth rotation clip | Future scroll-scrub section | Optional |
| G. Tooth `.glb` | Swaps the procedural hero tooth | Optional |

---

## 1. Images

### A. Hero poster (fallback image if you add a hero video)
- **File:** `/public/assets/images/hero-poster.jpg`
- **Config key:** `assets.images.heroPoster`
- **Aspect / size:** 16:9, 1920×1080, JPG
- **Google Flow / image prompt:**
  > A single glossy, pristine white molar tooth floating in a deep navy-black studio, soft teal rim light (#3FD0C0) glowing from behind, tiny floating light particles, subtle reflection beneath, cinematic premium product photography, shallow depth of field, dark moody background, ultra-clean, 16:9.

### B. Clinic interior 1
- **File:** `/public/assets/images/clinic-1.jpg`
- **Config key:** `assets.images.clinic1`
- **Aspect / size:** 4:3, 1600×1200, JPG
- **Prompt:**
  > Modern minimalist dental clinic reception, warm off-white and teal accents, soft diffused daylight, calm spa-like atmosphere, plants, clean architectural lines, premium interior photography, no people, 4:3.

### C. Clinic interior 2 (treatment room)
- **File:** `/public/assets/images/clinic-2.jpg`
- **Config key:** `assets.images.clinic2`
- **Aspect / size:** 4:3, 1600×1200, JPG
- **Prompt:**
  > A serene modern dental treatment room, sleek teal-and-white dental chair, large window with soft natural light, spotless, calming minimalist design, premium interior photography, no people, 4:3.

### D. Doctor portraits (4) — optional, replaces initials
- **Files:** `/public/assets/images/doctor-1.jpg` … `doctor-4.jpg`
- **Config:** set `photo: "/assets/images/doctor-1.jpg"` on each doctor in `config.js`.
- **Aspect / size:** 1:1 square, 800×800, JPG (face centered)
- **Prompt (vary gender/age per doctor):**
  > Professional headshot of a friendly dentist in clean white clinical attire, soft studio lighting, dark neutral background, warm confident smile, shallow depth of field, premium corporate portrait, square 1:1 crop centered on face.

---

## 2. Videos (optional — the site works beautifully without them)

### E. Hero background loop (ambient, behind the 3D tooth)
- **File:** `/public/assets/videos/hero-loop.mp4`
- **Config key:** `assets.videos.heroLoop`
- **Spec:** 16:9, 1920×1080, **8–12 s seamless loop**, no audio, H.264
- **Google Flow prompt:**
  > Slow abstract loop of soft teal and mint light particles drifting through deep navy-black space, gentle volumetric glow, bokeh, very slow camera drift, cinematic, dark, premium, seamless loop, no text, 1920x1080, 10 seconds.
- **Camera/lighting notes:** locked-off or ultra-slow dolly; low exposure so UI text stays readable; keep motion subtle.

### F. Scroll-scrubbed tooth rotation (for a future scroll-scrub section)
- **File:** `/public/assets/videos/tooth-rotation.mp4`
- **Config key:** `assets.videos.toothScrub`
- **Spec:** 1:1 or 16:9, **360° single rotation**, 5–6 s, **constant speed**, transparent or black bg, H.264
- **Google Flow prompt:**
  > A single glossy pristine white molar tooth rotating a smooth full 360 degrees on a turntable, centered, deep black background, soft teal studio rim lighting, subtle specular highlights, product-shot style, constant rotation speed, 1:1, 6 seconds, loopable.
- **Note:** render at a constant angular speed so frame-by-frame scrubbing feels linear.

---

## 3. 3D model (optional — swap the procedural tooth for a real .glb)

- **File:** `/public/assets/models/tooth.glb`
- **Config:** set `hero3d.glb: "/assets/models/tooth.glb"` in `config.js` — the code
  already loads it with `GLTFLoader`, centers it, scales it, and applies the glossy
  material. If loading fails it falls back to the procedural tooth automatically.
- **Where to get one:**
  - Search **Sketchfab** for “tooth molar” (filter: downloadable, glTF). Good free options exist.
  - Or generate one with **Meshy.ai / Luma Genie** using the prompt:
    > A realistic glossy human molar tooth, clean white enamel, two roots, smooth cusped crown, game-ready, centered, neutral pose.
  - Keep it low-to-mid poly (< 100k tris) and apply no baked textures — the site
    re-materials it for the glossy teal look.

---

## 4. Compressing your videos (ffmpeg)

After exporting from Google Flow, compress before adding so the site stays fast.
Install ffmpeg, then from the folder containing your source file run:

```bash
ffmpeg -i input.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart hero-loop.mp4
```

- `-crf 24` → quality (lower = better/larger; 20–26 is the sweet spot).
- `-an` → strips audio (not needed for background loops).
- `+faststart` → lets the video start playing before fully downloaded.
- For the square tooth video, change `scale=1920:-2` to `scale=1080:-2`.

For an even smaller web-optimized WebM (optional, add as a second `<source>`):

```bash
ffmpeg -i input.mp4 -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -an webm-output.webm
```

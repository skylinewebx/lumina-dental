# Lumina Dental Care — Premium Demo Website

A dark-themed, fully animated demo site for a dental clinic. Built with
**Vite + vanilla JS**, **Three.js** (3D tooth that follows the cursor),
**GSAP + ScrollTrigger** (scroll reveals), and **Lenis** (smooth scrolling).

> This is a **demo** with realistic sample content. No sign-up, sign-in, cart or login.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (default **http://localhost:5173**).

Build for production / preview the build:

```bash
npm run build
npm run preview
```

---

## Where to put your assets

| Asset            | Folder                          |
|------------------|---------------------------------|
| Images / photos  | `public/assets/images/`         |
| Videos           | `public/assets/videos/`         |
| 3D model (.glb)  | `public/assets/models/`         |

See **[ASSETS.md](ASSETS.md)** for the exact file names, Google Flow prompts
(aspect ratio, duration, lighting, camera notes), and an ffmpeg command to
compress videos. Until your files arrive, the site uses polished placeholders.

---

## What to edit (one file for everything)

Open **`src/config.js`** — it holds all business content:

| You want to change… | Edit in `config.js` |
|---|---|
| **Clinic name** | `clinic.name` (also updates nav, footer, title) |
| **Headline words** | `clinic.heroWords` (last word is the teal accent) |
| **Phone number** | `contact.phoneDisplay` **and** `contact.phoneHref` |
| **WhatsApp number** | `whatsappNumber` — digits only, international, no `+` (e.g. `919876543210`) |
| **Email / address / hours** | `contact.*` |
| **Social links** | `social.*` |
| **Services** | `services[]` (icon, title, desc) |
| **Prices** | `prices[]` (name, price) + `pricesNote` |
| **Doctors** | `doctors[]` (name, speciality, qualification, experience, photo) |
| **Reviews** | `reviews[]` (name, stars, text) |
| **Treatments in form** | `treatments[]` |
| **Time slots** | `timeSlots[]` — set `available: false` to grey one out |
| **Map location** | `contact.mapEmbed` (paste a Google Maps “embed” src URL) |
| **Swap 3D tooth for a model** | `hero3d.glb` = `/assets/models/tooth.glb` |
| **Asset paths** | `assets.images.*`, `assets.videos.*` |

No other file needs touching to rebrand the site.

---

## Deploy to Netlify

The repo already includes `netlify.toml` (build command `npm run build`, publish
dir `dist`). Two ways to go live:

**A. Connect the GitHub repo (recommended)**
1. Go to <https://app.netlify.com> → **Add new site → Import an existing project**.
2. Choose **GitHub** and pick the `lumina-dental-care` repository.
3. Netlify reads `netlify.toml`, so just confirm: build `npm run build`, publish `dist`.
4. Click **Deploy**. Every push to `main` auto-deploys.

**B. Netlify CLI (from your machine)**
```bash
npm i -g netlify-cli
netlify login          # opens the browser to authorise
npm run build
netlify deploy --prod --dir=dist
```

## Media pipeline (optional, already run)

Raw assets live outside the repo. To re-optimise after adding new raw files:
```bash
npm run media          # images → AVIF/WebP + sizes + blur; videos → MP4/WebM + posters
node scripts/fetch-fonts.mjs   # re-download/self-host the Latin font subsets
```

## Project structure

```
index.html              # markup + section shells
src/
  config.js             # ← ALL content you edit
  style.css             # theme tokens + all styles
  main.js               # boot: wires modules together
  modules/
    content.js          # renders sections from config (icons, cards, map…)
    hero3d.js           # Three.js tooth: lerp mouse-follow + idle float
    scroll.js           # Lenis smooth scroll + GSAP reveals/parallax/progress
    cursor.js           # custom cursor + magnetic buttons
    theme.js            # light/dark toggle, remembered in localStorage
    form.js             # appointment form, date→day, slots, WhatsApp
public/assets/          # your images / videos / models go here
```

---

## Features

- **3D hero tooth** — glossy, teal-glowing, lerp-follows the cursor on all axes
  (heavy/premium easing). Follows touch on mobile; gentle idle float + slow spin
  when there's no input. Procedural by default; drop in a `.glb` to swap.
- **Smooth everything** — Lenis smooth scroll (soft & heavy), GSAP `power3/expo`
  eased reveals, word/line splits, directional service-card entrances, staggered
  price rows, parallax, top scroll-progress bar.
- **Pricing** — dark rows with dim prices that light up teal with a bright price on hover.
- **Doctors** — 3D hover tilt. **Reviews** — slow auto-scrolling marquee with star ratings.
- **Appointment** — date picker (no past dates), auto weekday, time-slot chips
  (unavailable greyed out), animated success state, opens WhatsApp pre-filled.
- **Custom cursor** (dot + ring that grows on hover), **magnetic buttons**.
- **Light/Dark toggle** (dark default), remembered. Dark-filtered map in dark mode.
- **Accessible & responsive** — semantic HTML, labels, visible focus, good contrast,
  `prefers-reduced-motion` respected. On mobile, heavy effects are lightened
  (no custom cursor, no pinning). Animates only transform & opacity for 60fps.
```

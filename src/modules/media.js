/* =============================================================================
   MEDIA HELPERS — instant-feel loading
   • responsivePicture(): AVIF/WebP <picture> with srcset/sizes, explicit
     aspect-ratio (zero CLS), a blurred LQIP background that fades to the real
     image on load. Eager for the hero (LCP), lazy for everything below.
   • lazyVideo(): poster shown instantly; real sources + playback attach only
     when the block is ~600px from entering view; the video fades in over the
     poster. Honours reduced-motion and Data-Saver (poster only).
   Manifest (widths + LQIP data URIs) is produced by scripts/optimize-media.mjs.
   ========================================================================== */
import manifest from "../assets-manifest.json";

const IMG_BASE = "/assets/images";
const VID_BASE = "/assets/videos";

const saveData =
  (navigator.connection && navigator.connection.saveData) ||
  (navigator.connection && /2g/.test(navigator.connection.effectiveType || ""));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Responsive <picture> ------------------------------------------------ */
export function responsivePicture(name, { alt = "", sizes = "100vw", eager = false, className = "" } = {}) {
  const m = manifest.images?.[name];
  if (!m) return `<div class="img-missing ${className}" role="img" aria-label="${alt}"></div>`;

  const srcset = (ext) => m.widths.map((w) => `${IMG_BASE}/${name}-${w}.${ext} ${w}w`).join(", ");
  const fallbackW = m.widths[Math.min(1, m.widths.length - 1)]; // ~800 if present
  const loading = eager ? "eager" : "lazy";
  const priority = eager ? 'fetchpriority="high"' : "";
  const h = Math.round(1000 / m.ratio);

  return `
  <picture class="pic ${className}">
    <source type="image/avif" srcset="${srcset("avif")}" sizes="${sizes}">
    <source type="image/webp" srcset="${srcset("webp")}" sizes="${sizes}">
    <img class="blur-up" src="${IMG_BASE}/${name}-${fallbackW}.webp"
         width="1000" height="${h}" style="aspect-ratio:${m.ratio};background-image:url('${m.lqip}')"
         alt="${alt}" loading="${loading}" decoding="async" ${priority}>
  </picture>`;
}

// Fade the real image in over its blur once it is fully decoded (no flash).
export function initBlurUp() {
  document.querySelectorAll("img.blur-up").forEach((img) => {
    const done = () => img.classList.add("is-loaded");
    if (img.complete && img.naturalWidth) { done(); return; }
    // Prefer decode() so the bitmap is ready before we reveal it.
    if (img.decode) {
      const tryDecode = () => img.decode().then(done).catch(() => img.addEventListener("load", done, { once: true }));
      img.addEventListener("load", () => img.decode().then(done).catch(done), { once: true });
      tryDecode();
    } else {
      img.addEventListener("load", done, { once: true });
    }
  });
}

/* ---- Lazy video with poster + fade -------------------------------------- */
export function lazyVideo(name, { className = "", eagerMobile = false } = {}) {
  const poster = `${VID_BASE}/${name}-poster.webp`;
  // eagerMobile marks a clip (the hero) that should begin on phones right after
  // first paint instead of waiting for the first interaction.
  return `
  <video class="lazy-video ${className}" data-name="${name}"${eagerMobile ? ' data-eager="1"' : ""} playsinline muted loop
         preload="none" poster="${poster}" aria-hidden="true"></video>`;
}

// Attach sources + play when near viewport (rootMargin 600px). Fade in on play.
export function initLazyVideos() {
  const vids = document.querySelectorAll("video.lazy-video");
  if (!vids.length) return;

  const attach = (v) => {
    if (v.dataset.loaded) return;
    v.dataset.loaded = "1";
    const name = v.dataset.name;
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const q = isMobile ? "mobile" : "desktop";

    // Data-Saver / reduced-motion / 2G → keep the poster, don't fetch or play.
    if (saveData || reduced) return;

    const add = (type, ext) => {
      const s = document.createElement("source");
      s.type = type;
      s.src = `${VID_BASE}/${name}-${q}.${ext}`;
      v.appendChild(s);
    };
    // MP4 first: for these clips H.264 came out smaller than VP9, and the
    // browser uses the first playable source. WebM stays as an alternative.
    add("video/mp4", "mp4");
    add("video/webm", "webm");
    v.preload = "auto";
    v.load();
    v.play().then(() => v.classList.add("is-playing")).catch(() => {
      // Autoplay blocked (iOS low-power): resume on first interaction.
      const resume = () => { v.play().then(() => v.classList.add("is-playing")).catch(() => {}); cleanup(); };
      const cleanup = () => ["touchstart", "click", "scroll"].forEach((e) => window.removeEventListener(e, resume));
      ["touchstart", "click", "scroll"].forEach((e) => window.addEventListener(e, resume, { once: true, passive: true }));
    });
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { attach(e.target); } }),
    { rootMargin: "800px 0px" } // start loading well before it scrolls in
  );
  // Start observing after full load so video bytes never compete with the LCP
  // image/fonts. On phones, wait for the FIRST interaction before touching any
  // video — posters show meanwhile — so video decode never runs during the
  // initial (non-interactive) load. Huge win for throttled/low-end devices.
  const idle = (fn) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 300));
  const observeAll = () => vids.forEach((v) => io.observe(v));
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const schedule = () => {
    if (isMobile) {
      // Eager clips (the hero) still start on idle right after first paint —
      // one clip only, post-load, so load-time jank never returns. Everything
      // else waits for the first interaction.
      const eager = [...vids].filter((v) => v.dataset.eager);
      const rest = [...vids].filter((v) => !v.dataset.eager);
      if (eager.length) idle(() => eager.forEach((v) => io.observe(v)));
      const evs = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"];
      const go = () => { evs.forEach((e) => window.removeEventListener(e, go)); rest.forEach((v) => io.observe(v)); };
      evs.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    } else {
      // Desktop: attach on idle so decode stays off the load/TTI path.
      idle(observeAll);
    }
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  // Pause videos while off-screen / tab hidden (battery + perf).
  const playIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      const v = e.target;
      if (!v.dataset.loaded) return;
      if (e.isIntersecting && !document.hidden) v.play().catch(() => {});
      else v.pause();
    }),
    { threshold: 0.01 }
  );
  vids.forEach((v) => playIO.observe(v));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) vids.forEach((v) => v.pause());
  });
}

export const hasManifest = !!(manifest.images && Object.keys(manifest.images).length);

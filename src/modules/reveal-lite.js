/* =============================================================================
   REVEAL-LITE — the scroll/reveal engine for ALL devices.
   Pure IntersectionObserver + CSS classes: NO GSAP, NO Lenis, so it adds almost
   nothing to the main thread. Handles: line-split headings, directional card
   entrances, generic reveals, the top progress bar and smooth anchor scroll.
   (Desktop additionally loads enhance-desktop.js for Lenis + magnetic cursor.)
   ========================================================================== */

export function initReveals() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  // Smooth anchor scrolling (native; Lenis takes over on desktop if loaded).
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      document.getElementById("mobileMenu")?.classList.remove("is-open");
      document.getElementById("navBurger")?.classList.remove("is-open");
    });
  });

  // Top progress bar (passive scroll listener, transform only).
  const bar = document.getElementById("scrollProgress");
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  if (reduced) return; // content is already visible; no entrance animation

  root.classList.add("anim");

  // Split headings into lines so they can rise in.
  document.querySelectorAll("[data-split]").forEach(splitIntoLines);

  // Directional entrance per service card (via CSS custom props).
  const dirs = [[-60, 0], [60, 0], [0, 50], [-60, 0], [60, 0], [0, 50], [-60, 0], [60, 0]];
  document.querySelectorAll(".service-card").forEach((card, i) => {
    const [ex, ey] = dirs[i % dirs.length];
    card.style.setProperty("--ex", ex + "px");
    card.style.setProperty("--ey", ey + "px");
  });

  // One observer reveals everything by toggling .is-in (CSS does the motion).
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }),
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
  );
  const targets = document.querySelectorAll(
    "[data-reveal], [data-split], .service-card, .price-item, .doctor-card"
  );
  // Stagger grouped items with a small per-index transition-delay.
  const groups = {};
  targets.forEach((el) => {
    const key = el.parentElement;
    groups.k = groups.k || new Map();
    const arr = groups.k.get(key) || [];
    arr.push(el); groups.k.set(key, arr);
    io.observe(el);
  });
  groups.k && groups.k.forEach((arr) => arr.forEach((el, i) => {
    if (el.matches(".service-card, .price-item, .doctor-card")) el.style.transitionDelay = (i % 4) * 0.07 + "s";
  }));

  // Mark success so the boot failsafe knows reveals initialised.
  window.__revealsReady = true;
}

/* Wrap a heading's words into .line > span blocks (measured by offsetTop). */
export function splitIntoLines(el) {
  const text = el.textContent.trim();
  el.textContent = "";
  const words = text.split(" ");
  const wordSpans = words.map((w) => {
    const s = document.createElement("span");
    s.style.display = "inline-block";
    s.textContent = w;
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    return s;
  });
  const lines = [];
  let current = null, lastTop = null;
  wordSpans.forEach((s) => {
    const top = s.offsetTop;
    if (top !== lastTop) { current = []; lines.push(current); lastTop = top; }
    current.push(s.textContent);
  });
  el.textContent = "";
  lines.forEach((w) => {
    const line = document.createElement("span");
    line.className = "line";
    const inner = document.createElement("span");
    inner.textContent = w.join(" ");
    line.appendChild(inner);
    el.appendChild(line);
  });
}

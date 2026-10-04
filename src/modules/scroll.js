/* =============================================================================
   SMOOTH SCROLL + SCROLL ANIMATION
   Lenis for buttery, heavy smooth scrolling; GSAP ScrollTrigger for reveals,
   text splits, directional service cards, staggered price rows, parallax,
   and the top progress bar. Mobile lightens the effects (no pinning).
   ========================================================================== */
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScroll() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  /* ---- Lenis smooth scroll (soft & heavy) ---- */
  let lenis;
  if (!reduced) {
    lenis = new Lenis({
      duration: 1.4,              // heavy, not fast
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links -> smooth scroll via Lenis.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: "smooth" });
      // close mobile menu if open
      document.getElementById("mobileMenu")?.classList.remove("is-open");
      document.getElementById("navBurger")?.classList.remove("is-open");
    });
  });

  /* ---- Top progress bar ---- */
  const bar = document.getElementById("scrollProgress");
  if (bar) {
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; },
    });
  }

  if (reduced) return; // honour reduced motion: no entrance animation

  // Activate the animation layer. CSS only hides elements while html.anim is
  // present, so everything is visible by default. If any setup throws we strip
  // the class again (and clear inline hides) so no text is ever stuck hidden.
  const root = document.documentElement;
  root.classList.add("anim");

  try {
    /* ---- Generic reveal (eyebrows, paragraphs, CTAs) ---- */
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: "top 90%",
        onEnter: () => el.classList.add("is-in"),
      });
    });

    /* ---- Split headings: reveal line by line (class-based CSS reveal) ---- */
    gsap.utils.toArray("[data-split]").forEach((h) => {
      splitIntoLines(h);
      ScrollTrigger.create({
        trigger: h, start: "top 88%",
        onEnter: () => h.classList.add("is-in"),
      });
    });

    /* ---- Services: each card enters from a DIFFERENT direction ----
       Direction is set via CSS custom props (--ex/--ey, used by the gated
       hidden state), and we just toggle .is-in — so a reveal that never fires
       still leaves the card fully visible.                                */
    const dirs = [
      [-80, 0], [80, 0], [0, 80],   // left, right, below…
      [-80, 0], [80, 0], [0, 80],
      [-80, 0], [80, 0],
    ];
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      const [ex, ey] = dirs[i % dirs.length];
      card.style.setProperty("--ex", ex + "px");
      card.style.setProperty("--ey", ey + "px");
      card.style.transitionDelay = (i % 3) * 0.08 + "s";
      ScrollTrigger.create({
        trigger: card, start: "top 92%",
        onEnter: () => card.classList.add("is-in"),
      });
    });

    /* ---- Pricing rows: staggered reveal (class-based) ---- */
    ScrollTrigger.batch(".price-row", {
      start: "top 94%",
      onEnter: (batch) =>
        batch.forEach((el, i) => {
          el.style.transitionDelay = i * 0.06 + "s";
          el.classList.add("is-in");
        }),
    });

    /* ---- Doctors: staggered reveal (class-based) ---- */
    ScrollTrigger.batch(".doctor-card", {
      start: "top 90%",
      onEnter: (batch) =>
        batch.forEach((el, i) => {
          el.style.transitionDelay = i * 0.1 + "s";
          el.classList.add("is-in");
        }),
    });
  } catch (err) {
    // Animation setup failed → reveal everything, never leave text invisible.
    console.warn("[scroll] animation setup failed, revealing all content:", err);
    root.classList.remove("anim");
  }

  /* ---- Hero parallax drift on scroll (desktop only) ---- */
  if (!isMobile) {
    gsap.to(".hero__inner", {
      yPercent: 18, opacity: 0.6, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__glow", {
      yPercent: 30, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  // Recalculate once fonts/layout settle.
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/* Wrap a heading's text into .line > span blocks so we can slide lines up.
   Simple word-grouping by measuring offsetTop after wrapping each word. */
function splitIntoLines(el) {
  const text = el.textContent.trim();
  el.textContent = "";
  const words = text.split(" ");
  const wordSpans = words.map((w) => {
    const s = document.createElement("span");
    s.className = "word-measure";
    s.style.display = "inline-block";
    s.textContent = w;
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    return s;
  });

  // Group words by their vertical offset into lines.
  const lines = [];
  let current = null;
  let lastTop = null;
  wordSpans.forEach((s) => {
    const top = s.offsetTop;
    if (top !== lastTop) { current = []; lines.push(current); lastTop = top; }
    current.push(s.textContent);
  });

  el.textContent = "";
  lines.forEach((words) => {
    const line = document.createElement("span");
    line.className = "line";
    const inner = document.createElement("span");
    inner.textContent = words.join(" ");
    line.appendChild(inner);
    el.appendChild(line);
  });
}

/* =============================================================================
   LUMINA DENTAL CARE — ENTRY POINT
   Wires every module together. Content first (so the DOM exists), then the
   behaviours that enhance it.
   ========================================================================== */
import "./fonts.css";
import "./style.css";
import { renderContent, renderSections } from "./modules/content.js";
import { initTheme } from "./modules/theme.js";
import { initForm } from "./modules/form.js";

function boot() {
  renderContent();   // LIGHT above-the-fold essentials (hero, nav, footer)
  initTheme();       // light/dark + remembered choice
  initForm();        // appointment form + WhatsApp

  // Everything below the fold is built on idle, AFTER first paint, so the heavy
  // DOM work never delays LCP/TTI. Then the reveal engine (all devices) and the
  // desktop-only enhancement (Lenis + magnetic cursor) start.
  const buildAndEnhance = () => {
    renderSections(); // services, pricing, doctors, reviews, studio, contact…
    import("./modules/reveal-lite.js")
      .then((m) => m.initReveals())
      .catch(() => document.documentElement.classList.remove("anim")); // never hide text
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      import("./modules/enhance-desktop.js").then((m) => m.initDesktopEnhance()).catch(() => {});
    }
  };
  const schedule = () =>
    "requestIdleCallback" in window ? requestIdleCallback(buildAndEnhance, { timeout: 1600 }) : setTimeout(buildAndEnhance, 200);
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  // Defer the heavy 3D (three.js) so page text/layout paint first. The instant
  // hero poster stays until the live tooth is ready, then crossfades in.
  let started3D = false;
  const load3D = () => {
    if (started3D) return;
    started3D = true;
    import("./modules/hero3d.js")
      .then((m) => m.initHero3D())
      .catch((err) => console.warn("[hero3d] failed to load; poster kept:", err));
  };
  // Activate the live 3D on the FIRST real interaction — natural for a
  // mouse-follow tooth, and it keeps all WebGL/shader work out of the initial
  // load so the page stays instantly interactive. A gentle fallback starts it
  // for passive viewers shortly after load. The instant poster shows meanwhile.
  const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"];
  const onFirst = () => { events.forEach((e) => window.removeEventListener(e, onFirst)); load3D(); };
  events.forEach((e) => window.addEventListener(e, onFirst, { once: true, passive: true }));

  // Hero headline word reveal (runs after content render).
  revealHero();

  // Reveal the hero's above-the-fold content immediately (don't wait for the
  // deferred reveal engine) using the same .is-in class, staggered.
  if (document.documentElement.classList.contains("anim")) {
    document.querySelectorAll(".hero [data-reveal]").forEach((el, i) => {
      el.style.transitionDelay = `${0.15 + i * 0.12}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-in")));
    });
  }

  // Navbar scrolled state + mobile menu.
  initNav();

  // Text-visibility failsafe: if anything in view is still hidden a few seconds
  // after load (e.g. a trigger silently failed), reveal it so no text is lost.
  const sweep = () => {
    const inView = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    };
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => inView(el) && el.classList.add("is-in"));
    document.querySelectorAll(".service-card:not(.is-in), .price-row:not(.is-in), .doctor-card:not(.is-in)")
      .forEach((el) => inView(el) && el.classList.add("is-in"));
    document.querySelectorAll("[data-split]").forEach((h) => {
      if (inView(h)) h.querySelectorAll(".line > span").forEach((s) => (s.style.transform = "translateY(0)"));
    });
  };
  window.addEventListener("load", () =>
    setTimeout(() => {
      // If the reveal engine never loaded, un-hide everything so no text is lost.
      if (!window.__revealsReady) document.documentElement.classList.remove("anim");
      sweep();
    }, 3000)
  );
}

function revealHero() {
  const inners = document.querySelectorAll(".hero__title .inner");
  const animating = document.documentElement.classList.contains("anim");
  // If the animation layer isn't active (reduced motion / setup failed), the
  // words are already visible via CSS — nothing to do.
  if (!animating) { inners.forEach((s) => (s.style.transform = "none")); return; }
  inners.forEach((s, i) => {
    s.style.transition = "transform 1s cubic-bezier(0.16,1,0.3,1)";
    s.style.transitionDelay = `${0.15 + i * 0.1}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => (s.style.transform = "translateY(0)")));
  });
  // Failsafe: whatever happens, make sure the headline is shown within 1.6s.
  setTimeout(() => inners.forEach((s) => (s.style.transform = "translateY(0)")), 1600);
}

function initNav() {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobileMenu");
  burger?.addEventListener("click", () => {
    const open = burger.classList.toggle("is-open");
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

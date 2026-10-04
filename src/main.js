/* =============================================================================
   LUMINA DENTAL CARE — ENTRY POINT
   Wires every module together. Content first (so the DOM exists), then the
   behaviours that enhance it.
   ========================================================================== */
import "./fonts.css";
import "./style.css";
import { renderContent } from "./modules/content.js";
import { initTheme } from "./modules/theme.js";
import { initScroll } from "./modules/scroll.js";
import { initCursor } from "./modules/cursor.js";
import { initForm } from "./modules/form.js";

function boot() {
  renderContent();   // build data-driven sections from config
  initTheme();       // light/dark + remembered choice
  initForm();        // appointment form + WhatsApp
  initCursor();      // custom cursor + magnetic buttons
  initScroll();      // Lenis smooth scroll + GSAP reveals

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
  window.addEventListener("load", () => setTimeout(sweep, 2500));
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

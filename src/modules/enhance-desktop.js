/* =============================================================================
   DESKTOP ENHANCEMENT (loaded only on pointer-capable, wide screens, after
   first paint). Adds the premium touches that aren't worth their weight on
   phones: Lenis smooth scrolling, hero parallax and the magnetic custom cursor.
   None of this is on the critical path.
   ========================================================================== */
import Lenis from "lenis";
import { initCursor } from "./cursor.js";

export function initDesktopEnhance() {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  window.__lenis = lenis; // reveal-lite's anchor links use this if present

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Hero parallax — transform/opacity only, driven by Lenis scroll position.
  const inner = document.querySelector(".hero__inner");
  const glow = document.querySelector(".hero__glow");
  lenis.on("scroll", ({ scroll }) => {
    const y = Math.min(scroll, 900);
    if (inner) {
      inner.style.transform = `translateY(${y * 0.18}px)`;
      inner.style.opacity = String(Math.max(0, 1 - scroll / 650));
    }
    if (glow) glow.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
  });

  initCursor(); // custom cursor dot/ring + magnetic buttons

  // Services: 3D tilt toward the cursor + a moving light spot (--mx/--my).
  // The card carries a long (~1s) entrance transition on transform; swap in a
  // snappy transition while hovering so the tilt stays responsive, then restore
  // the CSS transition on leave (the entrance has already run by then).
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointerenter", () => { card.style.transition = "transform .25s var(--ease)"; });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.transform =
        `perspective(700px) rotateY(${(px - 0.5) * 10}deg) rotateX(${-(py - 0.5) * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; card.style.transition = ""; });
  });

  // Doctors: subtle photo parallax within the circular frame.
  const docImgs = [...document.querySelectorAll(".doctor-card .doctor-photo img")];
  if (docImgs.length) {
    const parallax = () => {
      const vh = window.innerHeight;
      docImgs.forEach((img) => {
        const r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const off = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
        img.style.transform = `translate3d(0, ${off * -14}px, 0) scale(1.08)`;
      });
    };
    lenis.on("scroll", parallax);
    parallax();
  }
}

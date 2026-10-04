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
}

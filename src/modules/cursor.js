/* =============================================================================
   CUSTOM CURSOR + MAGNETIC BUTTONS
   A small dot that tracks the pointer exactly, and a ring that lerps behind it
   and grows over interactive elements. Magnetic elements lean toward the dot.
   Fully disabled on touch devices and under reduced-motion.
   ========================================================================== */
import { gsap } from "gsap";

export function initCursor() {
  const isTouch = window.matchMedia("(hover: none)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || reduced) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("cursor-ready");

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...mouse };

  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });

  // Ring follows with easing (lerp) for a soft trailing feel.
  function loop() {
    ringPos.x += (mouse.x - ringPos.x) * 0.18;
    ringPos.y += (mouse.y - ringPos.y) * 0.18;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Grow ring over links/buttons/anything marked [data-cursor].
  document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("is-hover"));
    el.addEventListener("pointerleave", () => ring.classList.remove("is-hover"));
  });

  // Hide when leaving the window.
  document.addEventListener("pointerleave", () => gsap.to([dot, ring], { opacity: 0, duration: .3 }));
  document.addEventListener("pointerenter", () => gsap.to([dot, ring], { opacity: 1, duration: .3 }));

  initMagnetic();
}

/* Magnetic buttons: translate slightly toward the cursor, spring back on leave. */
function initMagnetic() {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.4;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.6, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });
}

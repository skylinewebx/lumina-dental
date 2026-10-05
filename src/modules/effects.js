/* =============================================================================
   SECTION EFFECTS (all devices, loaded after first paint)
   Vanilla JS + IntersectionObserver — no GSAP needed, so it stays light on
   mobile. Handles: the pricing accordion, odometer stats + rings, the two-row
   reviews marquee, star pops, the "how it works" line, success confetti, the
   drifting background orbs, and an adaptive-quality fps monitor.
   ========================================================================== */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initEffects() {
  initAccordion();
  initStats();
  initReviewsMarquee();
  initStarsPop();
  initHowto();
  initConfetti();
  initOrbs();
  initRevealOnce("#slots", "pop");
  initRevealOnce(".footer__big", "is-in");
  initAdaptiveQuality();
}

/* Add `cls` to the first matching element(s) once they scroll into view. */
function initRevealOnce(selector, cls) {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  els.forEach((el) => io.observe(el));
}

/* ---- Pricing accordion -------------------------------------------------- */
function initAccordion() {
  const items = [...document.querySelectorAll("[data-acc]")];
  if (!items.length) return;
  const setOpen = (it, open) => {
    it.classList.toggle("is-open", open);
    it.querySelector(".price-row").setAttribute("aria-expanded", String(open));
  };
  items.forEach((it) => {
    it.querySelector(".price-row").addEventListener("click", () => {
      const open = it.classList.contains("is-open");
      items.forEach((o) => setOpen(o, false)); // one open at a time
      if (!open) setOpen(it, true);
      // ScrollTrigger positions shift when a panel opens/closes.
      setTimeout(() => window.__ScrollTrigger && window.__ScrollTrigger.refresh(), 500);
    });
  });

  // "Book this treatment" → scroll to form + preselect the treatment.
  document.querySelectorAll(".price-panel__book").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = b.dataset.treatment;
      const sel = document.getElementById("treatment");
      if (sel) {
        [...sel.options].forEach((o) => { if (o.textContent.trim() === name) sel.value = o.value; });
        sel.dispatchEvent(new Event("change"));
      }
      const appt = document.getElementById("appointment");
      if (window.__lenis) window.__lenis.scrollTo(appt, { offset: -50 });
      else appt?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  });
}

/* ---- Stats: odometer count-up + ring fill ------------------------------- */
function initStats() {
  const vals = [...document.querySelectorAll(".stat__value")];
  if (!vals.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      countUp(e.target);
      const ring = e.target.closest(".stat")?.querySelector(".stat__ring-fill");
      if (ring) ring.style.strokeDashoffset = "0";
    });
  }, { threshold: 0.4 });
  vals.forEach((v) => io.observe(v));
}
function countUp(el) {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.decimals || "0", 10);
  if (reduced) { el.textContent = dec ? to.toFixed(dec) : to.toLocaleString(); return; }
  const dur = 1500, start = performance.now();
  (function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const v = to * (1 - Math.pow(1 - p, 3)); // easeOutCubic
    el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = dec ? to.toFixed(dec) : to.toLocaleString();
  })(start);
}

/* ---- Reviews: two rows drifting in opposite directions ------------------ */
function initReviewsMarquee() {
  if (reduced) return;
  const a = document.getElementById("reviewsTrackA");
  const b = document.getElementById("reviewsTrackB");
  const wrap = document.getElementById("reviewsMarquee");
  if (!a || !b || !wrap) return;

  let paused = false, visible = true, xa = 0, xb = -half(b), rafId = null;
  function half(el) { return el.scrollWidth / 2 || 1; }
  wrap.addEventListener("pointerenter", () => (paused = true));
  wrap.addEventListener("pointerleave", () => (paused = false));

  const speed = 0.35;
  function step() {
    if (!paused && visible) {
      xa -= speed; if (Math.abs(xa) >= half(a)) xa = 0;
      a.style.transform = `translate3d(${xa}px,0,0)`;
      xb += speed; if (xb >= 0) xb = -half(b);
      b.style.transform = `translate3d(${xb}px,0,0)`;
    }
    rafId = requestAnimationFrame(step);
  }
  rafId = requestAnimationFrame(step);

  // Pause when off-screen / tab hidden.
  new IntersectionObserver((e) => (visible = e[0].isIntersecting), { threshold: 0 }).observe(wrap);
  document.addEventListener("visibilitychange", () => (visible = !document.hidden));
}

/* ---- Stars pop in when a review row enters view ------------------------- */
function initStarsPop() {
  const wrap = document.getElementById("reviewsMarquee");
  if (!wrap || reduced) return;
  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { wrap.classList.add("stars-pop"); obs.disconnect(); } });
  }, { threshold: 0.2 }).observe(wrap);
}

/* ---- How it works: line + steps light up on reveal --------------------- */
function initHowto() {
  const section = document.getElementById("howto");
  if (!section) return;
  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { section.classList.add("is-in"); obs.disconnect(); } });
  }, { threshold: 0.25 }).observe(section);
}

/* ---- Confetti burst on booking success --------------------------------- */
function initConfetti() {
  window.addEventListener("booking:success", () => { if (!reduced) burst(); });
}
function burst() {
  const c = document.createElement("canvas");
  c.className = "confetti-canvas";
  document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const dpr = Math.min(devicePixelRatio, 2);
  const resize = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; };
  resize();
  const colors = ["#3FD0C0", "#9FF5E6", "#ffffff", "#2aa89a"];
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 * dpr, y: innerHeight * 0.42 * dpr,
    vx: (Math.random() - 0.5) * 14 * dpr, vy: (Math.random() - 1.1) * 15 * dpr,
    g: 0.3 * dpr, s: (2 + Math.random() * 4) * dpr, c: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, life: 1,
  }));
  let t0 = performance.now();
  (function frame(now) {
    const dt = Math.min(32, now - t0); t0 = now;
    ctx.clearRect(0, 0, c.width, c.height);
    let alive = false;
    parts.forEach((p) => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.009;
      if (p.life > 0 && p.y < c.height + 40) {
        alive = true;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

/* ---- Background orbs: drift (CSS) + scroll parallax (JS) ---------------- */
function initOrbs() {
  const orbs = [...document.querySelectorAll(".orb")];
  if (!orbs.length || reduced) return;
  const factors = [0.12, -0.08, 0.05];
  let targetY = 0, curY = 0, raf = null, running = true;
  const onScroll = () => { targetY = window.scrollY; if (!raf) raf = requestAnimationFrame(loop); };
  function loop() {
    curY += (targetY - curY) * 0.08;
    orbs.forEach((o, i) => { o.style.transform = `translate3d(0, ${curY * factors[i % factors.length]}px, 0)`; });
    if (Math.abs(targetY - curY) > 0.5 && running) raf = requestAnimationFrame(loop);
    else raf = null;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", () => (running = !document.hidden));
}

/* ---- Adaptive quality: watch fps, dial effects down/up ------------------ */
function initAdaptiveQuality() {
  const root = document.documentElement;
  // Phones start one notch lighter.
  if (window.matchMedia("(max-width: 760px)").matches) root.classList.add("q-med");
  if (reduced) return;
  let last = performance.now(), ema = 16.7, frames = 0;
  (function monitor(now) {
    const dt = now - last; last = now;
    ema = ema * 0.9 + dt * 0.1;
    if (++frames % 40 === 0) {
      const fps = 1000 / ema;
      if (fps < 50) { root.classList.add("q-low"); }       // < 50fps → lighten
      else if (fps > 58) { root.classList.remove("q-low"); } // recovered → restore
    }
    requestAnimationFrame(monitor);
  })(last);
}

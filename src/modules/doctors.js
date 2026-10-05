/* =============================================================================
   CHOOSE YOUR SPECIALIST (doctors section)
   Layered portrait stage — the active doctor is large and in focus at the
   front, the others sit smaller and dimmed behind. Switch with the thumbnails,
   the arrows, arrow keys (desktop) or a swipe (mobile); the profile panel
   crossfades in. "Book with Dr. X" scrolls to the form and pre-selects them.
   Pure transform/opacity/filter transitions — no layout animation.
   ========================================================================== */
export function initDoctors() {
  const root = document.getElementById("specialist");
  const stage = document.getElementById("specialistStage");
  if (!root || !stage) return;

  const cards = [...stage.querySelectorAll(".spec-card")];
  const panels = [...document.querySelectorAll(".spec-panel")];
  const thumbs = [...document.querySelectorAll(".specialist__thumb")];
  const n = cards.length;
  if (!n) return;

  let active = 0;
  stage.setAttribute("tabindex", "0"); // allow arrow-key navigation when focused

  function layout() {
    cards.forEach((card, i) => {
      const offset = (i - active + n) % n;      // 0 = front, then behind
      card.className = "spec-card pos-" + offset;
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });
    panels.forEach((p, i) => {
      const on = i === active;
      p.classList.toggle("is-active", on);
      p.setAttribute("aria-hidden", String(!on));
    });
    thumbs.forEach((t, i) => {
      const on = i === active;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
  }
  function go(i) { active = (i + n) % n; layout(); }

  // Click a stage card that's behind → bring it forward.
  cards.forEach((card, i) => card.addEventListener("click", () => { if (i !== active) go(i); }));
  // Thumbnails + arrows.
  document.getElementById("specialistNav")?.addEventListener("click", (e) => {
    const thumb = e.target.closest(".specialist__thumb");
    const arrow = e.target.closest(".specialist__arrow");
    if (thumb) go(+thumb.dataset.i);
    else if (arrow) go(active + (+arrow.dataset.dir));
  });

  // Arrow keys when the section has focus.
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { go(active - 1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { go(active + 1); e.preventDefault(); }
  });

  // Swipe (touch) on the stage.
  let x0 = null;
  stage.addEventListener("pointerdown", (e) => { x0 = e.clientX; }, { passive: true });
  stage.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  });

  // "Book with Dr. X" → scroll to form + preselect.
  document.querySelectorAll(".spec-panel__book").forEach((b) => {
    b.addEventListener("click", () => {
      const name = b.dataset.doctor;
      const sel = document.getElementById("treatment"); // keep treatment as-is
      const docSel = document.getElementById("doctor");
      if (docSel) {
        [...docSel.options].forEach((o) => { if (o.textContent.startsWith(name)) docSel.value = o.value; });
        docSel.dispatchEvent(new Event("change"));
      }
      const appt = document.getElementById("appointment");
      if (window.__lenis) window.__lenis.scrollTo(appt, { offset: -50 });
      else appt?.scrollIntoView({ behavior: "smooth" });
    });
  });

  layout();
}

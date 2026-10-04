/* =============================================================================
   CONTENT RENDERING
   Builds every data-driven section from CONFIG: hero words, marquee, services,
   pricing, doctors, reviews, contact, map, footer. Edit config.js, not this.
   ========================================================================== */
import { CONFIG } from "../config.js";
import { responsivePicture, lazyVideo, initBlurUp, initLazyVideos } from "./media.js";

/* ---- Thin outline SVG icon set ---- */
const ICONS = {
  sparkle: '<path d="M12 3v18M3 12h18" /><path d="M7 7l10 10M17 7 7 17" opacity=".4"/>',
  whiten: '<path d="M12 3C8 3 6 6 6 10c0 5 2 11 3 11s1-3 3-3 2 3 3 3 3-6 3-11c0-4-2-7-6-7Z"/>',
  implant: '<path d="M12 2v9m0 0c-3 0-4 3-3 6m3-6c3 0 4 3 3 6M8 6h8"/>',
  align: '<rect x="4" y="9" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="6" rx="1"/><rect x="16" y="9" width="4" height="6" rx="1"/>',
  root: '<path d="M12 3c-3 0-5 2-5 6 0 6 3 12 5 12s5-6 5-12c0-4-2-6-5-6Z"/><path d="M12 9v8" opacity=".4"/>',
  kids: '<circle cx="12" cy="9" r="4"/><path d="M8 15c0 3 2 5 4 5s4-2 4-5"/><circle cx="10.5" cy="8.5" r=".6" fill="currentColor"/><circle cx="13.5" cy="8.5" r=".6" fill="currentColor"/>',
  crown: '<path d="M4 8l3 9h10l3-9-4 3-4-5-4 5-4-3Z"/>',
  emergency: '<path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z"/><path d="M12 9v4m0 3h.01" opacity=".5"/>',
};
const SOCIAL = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  facebook: '<path d="M14 8h2V5h-2c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8c0-.5.3-1 1-1Z"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10 9.5v5l4-2.5-4-2.5Z" fill="currentColor"/>',
  whatsapp: '<path d="M4 20l1.4-4A7.5 7.5 0 1 1 9 18.6L4 20Z"/><path d="M9 9c0 3 3 6 6 6l1.5-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2L9 9Z" fill="currentColor" stroke="none"/>',
  x: '<path d="M4 4l16 16M20 4 4 20" />',
};

const svg = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export function renderContent() {
  const { clinic, contact, social, services, prices, pricesNote, doctors, reviews } = CONFIG;

  /* ---- Hero headline: word-by-word reveal ---- */
  const titleEl = document.getElementById("heroTitle");
  if (titleEl) {
    titleEl.innerHTML = clinic.heroWords
      .map((w, i) => {
        const accent = i === clinic.heroWords.length - 1 ? " accent" : "";
        return `<span class="word"><span class="inner${accent}">${w}</span></span>`;
      })
      .join(" ");
  }
  document.querySelector(".hero__sub").textContent = clinic.heroSub;

  /* ---- Marquee ---- */
  const track = document.getElementById("marqueeTrack");
  if (track) {
    const items = ["Gentle care", "Modern technology", "Honest pricing", "Same-day relief", "Anxiety-friendly", "Trusted specialists"];
    const row = items.map((t) => `<span>${t}</span><span class="dot">·</span>`).join("");
    track.innerHTML = row + row; // duplicate for seamless loop
  }

  /* ---- Services ---- */
  const sg = document.getElementById("servicesGrid");
  if (sg) {
    sg.innerHTML = services
      .map(
        (s) => `
      <article class="service-card" data-cursor>
        <div class="service-card__icon">${svg(ICONS[s.icon] || ICONS.sparkle)}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </article>`
      )
      .join("");
  }

  /* ---- Pricing ---- */
  const pg = document.getElementById("pricingGrid");
  if (pg) {
    pg.innerHTML = prices
      .map(
        (p) => `
      <div class="price-row" data-cursor>
        <span class="price-row__name">${p.name}</span>
        <span class="price-row__price">${p.price}</span>
      </div>`
      )
      .join("");
  }
  const note = document.getElementById("pricingNote");
  if (note) note.textContent = pricesNote;

  /* ---- Doctors (with hover tilt) ---- */
  const dg = document.getElementById("doctorsGrid");
  if (dg) {
    dg.innerHTML = doctors
      .map((d) => {
        const initials = d.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("");
        const avatar = d.photoKey
          ? responsivePicture(d.photoKey, { alt: d.name, sizes: "140px", className: "doctor-photo" })
          : initials;
        return `
      <article class="doctor-card" data-tilt data-cursor>
        <div class="doctor-card__avatar">${avatar}</div>
        <h3>${d.name}</h3>
        <p class="doctor-card__spec">${d.speciality}</p>
        <div class="doctor-card__meta">
          <span>${d.qualification}</span>
          <span>${d.experience} experience</span>
        </div>
      </article>`;
      })
      .join("");
    initTilt();
  }

  /* ---- Reviews (duplicated track for seamless marquee) ---- */
  const rt = document.getElementById("reviewsTrack");
  if (rt) {
    const cardHtml = (r) => {
      const stars = Array.from({ length: 5 }, (_, i) =>
        i < r.stars ? "★" : '<span class="off">★</span>'
      ).join("");
      return `
      <article class="review-card">
        <div class="review-card__stars">${stars}</div>
        <p>“${r.text}”</p>
        <div class="review-card__name">— ${r.name}</div>
      </article>`;
    };
    const all = reviews.map(cardHtml).join("");
    rt.innerHTML = all + all;
    initReviewMarquee(rt);
  }

  /* ---- Contact ---- */
  const cl = document.getElementById("contactList");
  if (cl) {
    cl.innerHTML = `
      <li><span class="k">Phone</span><span class="v"><a href="${contact.phoneHref}">${contact.phoneDisplay}</a></span></li>
      <li><span class="k">Email</span><span class="v"><a href="mailto:${contact.email}">${contact.email}</a></span></li>
      <li><span class="k">Address</span><span class="v">${contact.address}</span></li>
      <li><span class="k">Hours</span><span class="v">${contact.hours.map((h) => `${h.day}: ${h.time}`).join("<br>")}</span></li>`;
  }
  const cs = document.getElementById("contactSocial");
  if (cs) {
    cs.innerHTML = Object.entries(SOCIAL)
      .map(
        ([k, inner]) =>
          `<a href="${social[k] || "#"}" target="_blank" rel="noopener" aria-label="${k}" data-cursor>${svg(inner)}</a>`
      )
      .join("");
  }
  const map = document.getElementById("mapFrame");
  if (map) map.src = contact.mapEmbed;

  /* ---- Footer ---- */
  const fc = document.getElementById("footerCopy");
  if (fc) fc.textContent = `© ${new Date().getFullYear()} ${clinic.name}. All rights reserved.`;

  // Update document title / brand text from config.
  document.querySelectorAll(".nav__logo-text").forEach((el, i) => {
    el.textContent = i === 0 ? clinic.name.split(" ")[0] : clinic.name;
  });

  /* ---- Media: hero ambient video, craft showcase, studio gallery ---- */
  const heroBg = document.getElementById("heroBg");
  if (heroBg) heroBg.innerHTML = lazyVideo("hero-bg", { className: "hero__bg-video" });

  const craftVideo = document.getElementById("craftVideo");
  if (craftVideo) craftVideo.innerHTML = lazyVideo("tooth-spin", { className: "craft__video" });

  const studioReception = document.getElementById("studioReception");
  if (studioReception) {
    studioReception.insertAdjacentHTML("afterbegin",
      responsivePicture("clinic-reception", { alt: "Lumina waiting lounge", sizes: "(max-width: 760px) 100vw, 55vw" }));
  }
  const studioRoom = document.getElementById("studioRoom");
  if (studioRoom) {
    studioRoom.insertAdjacentHTML("afterbegin",
      responsivePicture("clinic-room", { alt: "Lumina treatment suite", sizes: "(max-width: 760px) 100vw, 40vw" }));
  }

  // Activate blur-up fade-in and lazy video loading now the DOM exists.
  initBlurUp();
  initLazyVideos();
}

/* Doctor card 3D hover tilt (transform only). Disabled on touch. */
function initTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

/* Slow auto-scrolling reviews marquee using rAF (transform only). */
function initReviewMarquee(track) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let x = 0;
  let paused = false;
  const half = () => track.scrollWidth / 2;
  track.parentElement.addEventListener("pointerenter", () => (paused = true));
  track.parentElement.addEventListener("pointerleave", () => (paused = false));
  function step() {
    if (!paused) {
      x -= 0.4; // slow
      if (Math.abs(x) >= half()) x = 0;
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(step);
  }
  step();
}

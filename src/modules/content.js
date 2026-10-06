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
  // LIGHT, above-the-fold essentials only — runs before first paint.
  const { clinic } = CONFIG;

  // Hero headline/sub are in static HTML already; only build if missing.
  const titleEl = document.getElementById("heroTitle");
  if (titleEl && !titleEl.querySelector(".word")) {
    titleEl.innerHTML = clinic.heroWords
      .map((w, i) => {
        const accent = i === clinic.heroWords.length - 1 ? " accent" : "";
        return `<span class="word"><span class="inner${accent}">${w}</span></span>`;
      })
      .join(" ");
  }
  const subEl = document.querySelector(".hero__sub");
  if (subEl && !subEl.textContent.trim()) subEl.textContent = clinic.heroSub;

  // Brand text + footer copy.
  document.querySelectorAll(".nav__logo-text").forEach((el, i) => {
    el.textContent = i === 0 ? clinic.name.split(" ")[0] : clinic.name;
  });
  const fc = document.getElementById("footerCopy");
  if (fc) fc.textContent = `© ${new Date().getFullYear()} ${clinic.name}. All rights reserved.`;

  /* ---- Hero media: scene video + falling-teeth (video + drifting PNGs) ---- */
  const inc = CONFIG.incoming || {};
  const heroScene = document.getElementById("heroScene");
  if (heroScene && inc.heroScene) {
    heroScene.style.backgroundImage = `url(/assets/videos/${inc.heroScene}-poster.webp)`;
    heroScene.innerHTML = lazyVideo(inc.heroScene, { className: "hero__scene-video" });
  }

  const heroTeeth = document.getElementById("heroTeeth");
  if (heroTeeth) {
    let html = inc.teethFall ? lazyVideo(inc.teethFall, { className: "hero__teeth-video" }) : "";
    (inc.fallingTeeth || []).forEach((key, i) => {
      html += `<span class="falling-tooth" data-i="${i}">${responsivePicture(key, { alt: "", sizes: "90px", eager: false })}</span>`;
    });
    heroTeeth.innerHTML = html;
  }
  const heroFx = document.getElementById("heroFx");
  if (heroFx && inc.particles) heroFx.innerHTML = responsivePicture(inc.particles, { alt: "", sizes: "100vw" });
}

/* Heavy, below-the-fold sections — built after first paint / on idle. */
export function renderSections() {
  const { contact, social, services, prices, pricesNote, doctors, reviews } = CONFIG;

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
        ${s.imgKey ? `<div class="service-card__img">${responsivePicture(s.imgKey, { alt: s.title, sizes: "(max-width:760px) 100vw, 380px" })}</div>` : ""}
        <div class="service-card__icon">${svg(ICONS[s.icon] || ICONS.sparkle)}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </article>`
      )
      .join("");
  }

  /* ---- Pricing accordion (click to expand) ---- */
  const chev = `<svg class="price-row__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>`;
  const pg = document.getElementById("pricingGrid");
  if (pg) {
    pg.innerHTML = prices
      .map((p, i) => {
        const open = i === 0; // first row open by default
        return `
      <div class="price-item${open ? " is-open" : ""}" data-acc>
        <button class="price-row" id="accbtn-${i}" aria-expanded="${open}" aria-controls="acc-${i}" data-cursor>
          <span class="price-row__sweep" aria-hidden="true"></span>
          <span class="price-row__name">${p.name}</span>
          <span class="price-row__right">
            <span class="price-row__price">from ${p.price}</span>
            ${chev}
          </span>
        </button>
        <div class="price-panel" id="acc-${i}" role="region" aria-labelledby="accbtn-${i}">
          <div class="price-panel__inner">
            ${CONFIG.priceImages && CONFIG.priceImages[p.name] ? `<div class="price-panel__media">${responsivePicture(CONFIG.priceImages[p.name], { alt: p.name, sizes: "(max-width:760px) 100vw, 320px" })}</div>` : ""}
            <div class="price-panel__body">
            <div class="price-panel__meta">
              <div><span class="k">Price</span><span class="v">${p.range}</span></div>
              <div><span class="k">Duration</span><span class="v">${p.duration}</span></div>
              <div><span class="k">Visits</span><span class="v">${p.visits}</span></div>
              <div><span class="k">Aftercare</span><span class="v">${p.aftercare}</span></div>
            </div>
            <ul class="price-panel__includes">
              ${p.includes.map((x) => `<li>${x}</li>`).join("")}
            </ul>
            <button class="btn btn--primary price-panel__book" data-treatment="${p.name}" data-magnetic data-cursor>
              Book this treatment
            </button>
            </div>
          </div>
        </div>
      </div>`;
      })
      .join("");
  }
  const note = document.getElementById("pricingNote");
  if (note) note.textContent = pricesNote;

  /* ---- Doctors: "Choose Your Specialist" layered stage + profile -------- */
  const lastName = (n) => n.replace("Dr. ", "").split(" ").slice(-1)[0];
  const stage = document.getElementById("specialistStage");
  if (stage) {
    stage.innerHTML = doctors
      .map((d, i) => `
      <figure class="spec-card" data-i="${i}">
        ${d.photoKey ? responsivePicture(d.photoKey, { alt: d.name, sizes: "(max-width:760px) 80vw, 420px" })
          : `<span class="spec-card__initials">${d.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}</span>`}
        <figcaption class="spec-card__name">${d.name}<span>${d.speciality}</span></figcaption>
      </figure>`)
      .join("");
  }

  const panel = document.getElementById("specialistPanel");
  if (panel) {
    panel.innerHTML = doctors
      .map((d, i) => `
      <article class="spec-panel${i === 0 ? " is-active" : ""}" data-i="${i}" role="tabpanel" aria-hidden="${i === 0 ? "false" : "true"}">
        <p class="spec-panel__spec">${d.speciality}</p>
        <h3 class="spec-panel__name">${d.name}</h3>
        <p class="spec-panel__bio">${d.bio}</p>
        <div class="spec-panel__grid">
          <div><span class="k">Age</span><span class="v">${d.age}</span></div>
          <div><span class="k">Experience</span><span class="v">${d.experience}</span></div>
          <div><span class="k">In the field</span><span class="v">${d.inField}</span></div>
          <div><span class="k">At Lumina</span><span class="v">${d.atClinic}</span></div>
          <div><span class="k">Patients treated</span><span class="v">${d.patients}</span></div>
          <div><span class="k">Languages</span><span class="v">${d.languages.join(", ")}</span></div>
        </div>
        <div class="spec-panel__row"><span class="k">Qualifications</span><span class="v">${d.qualification} · ${d.university}</span></div>
        <div class="spec-panel__row"><span class="k">Key treatments</span><span class="v spec-panel__tags">${d.treatments.map((t) => `<span>${t}</span>`).join("")}</span></div>
        <button class="btn btn--primary spec-panel__book" data-doctor="${d.name}" data-magnetic data-cursor>Book with Dr. ${lastName(d.name)}</button>
      </article>`)
      .join("");
  }

  const nav = document.getElementById("specialistNav");
  if (nav) {
    nav.innerHTML =
      `<button class="specialist__arrow" data-dir="-1" aria-label="Previous specialist" data-cursor>‹</button>` +
      doctors.map((d, i) => `
        <button class="specialist__thumb${i === 0 ? " is-active" : ""}" data-i="${i}" role="tab" aria-selected="${i === 0}" aria-label="${d.name}, ${d.speciality}" data-cursor>
          ${d.photoKey ? responsivePicture(d.photoKey, { alt: "", sizes: "48px" }) : `<span>${d.name.replace("Dr. ", "")[0]}</span>`}
        </button>`).join("") +
      `<button class="specialist__arrow" data-dir="1" aria-label="Next specialist" data-cursor>›</button>`;
  }

  // Ambient clinic video behind the doctors section.
  const doctorsBg = document.getElementById("doctorsBg");
  if (doctorsBg && CONFIG.incoming?.doctorsLoop) {
    doctorsBg.style.backgroundImage = `url(/assets/videos/${CONFIG.incoming.doctorsLoop}-poster.webp)`;
    doctorsBg.innerHTML = lazyVideo(CONFIG.incoming.doctorsLoop, { className: "doctors__bg-video" });
  }

  /* ---- Stats band (odometer + ring; animated by effects.js on reveal) ---- */
  const statsBand = document.getElementById("statsBand");
  if (statsBand && CONFIG.stats) {
    statsBand.innerHTML = CONFIG.stats
      .map(
        (s) => `
      <div class="stat" data-reveal>
        <svg class="stat__ring" viewBox="0 0 72 72" aria-hidden="true">
          <circle class="stat__ring-bg" cx="36" cy="36" r="32"/>
          <circle class="stat__ring-fill" cx="36" cy="36" r="32"/>
        </svg>
        <div class="stat__num">
          <span class="stat__value" data-to="${s.value}" data-decimals="${s.decimals || 0}">0</span><span class="stat__suffix">${s.suffix || ""}</span>
        </div>
        <span class="stat__label">${s.label}</span>
      </div>`
      )
      .join("");
  }

  /* ---- Reviews: two rows (built in effects.js marquee) ---- */
  const starRow = (n) =>
    Array.from({ length: 5 }, (_, i) => (i < n ? '<span class="star">★</span>' : '<span class="star off">★</span>')).join("");
  const cardHtml = (r) => `
      <article class="review-card">
        <div class="review-card__stars" data-stars="${r.stars}">${starRow(r.stars)}</div>
        <p>“${r.text}”</p>
        <div class="review-card__name">— ${r.name}</div>
      </article>`;
  const half = Math.ceil(reviews.length / 2);
  const rowA = reviews.slice(0, half).map(cardHtml).join("");
  const rowB = reviews.slice(half).concat(reviews.slice(0, half)).map(cardHtml).join("");
  const rtA = document.getElementById("reviewsTrackA");
  const rtB = document.getElementById("reviewsTrackB");
  if (rtA) rtA.innerHTML = rowA + rowA;
  if (rtB) rtB.innerHTML = rowB + rowB;

  /* ---- How it works steps ---- */
  const howtoSteps = document.getElementById("howtoSteps");
  if (howtoSteps && CONFIG.howItWorks) {
    howtoSteps.innerHTML = CONFIG.howItWorks
      .map(
        (s) => `
      <div class="howto__step" data-reveal>
        <span class="howto__dot" aria-hidden="true"></span>
        <span class="howto__num">${s.step}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`
      )
      .join("");
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

  /* ---- Media: craft showcase + studio gallery (hero video set earlier) ---- */
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


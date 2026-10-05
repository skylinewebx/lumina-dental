/* =============================================================================
   LUMINA DENTAL CARE — SITE CONFIG
   -----------------------------------------------------------------------------
   This is the ONE file to edit for all business content.
   Change the clinic name, phone, WhatsApp number, prices, doctors and asset
   paths here and the whole site updates. Nothing else needs touching.
   ========================================================================== */

export const CONFIG = {
  /* ---- Clinic identity --------------------------------------------------- */
  clinic: {
    name: "Lumina Dental Care",
    tagline: "Where every smile finds its light.",
    // Shown in the hero as word-by-word reveal:
    heroWords: ["Dentistry", "that", "feels", "like", "light."],
    heroSub:
      "A calm, modern clinic built around gentle, precise care. Advanced technology, unhurried appointments, and a team that actually listens.",
  },

  /* ---- Contact details --------------------------------------------------- */
  contact: {
    // All sample values for this demo — replace with the real clinic details.
    phoneDisplay: "+1 (415) 555-0137",
    phoneHref: "tel:+14155550137",
    email: "hello@luminadental.care",
    address: "1200 Marine Parkway, Suite 310, Redwood City, CA 94065, USA",
    hours: [
      { day: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
      { day: "Saturday", time: "9:00 AM – 2:00 PM" },
      { day: "Sunday", time: "Emergencies only" },
    ],
    // Any sample location works — this is a demo (neutral US location).
    mapEmbed: "https://www.google.com/maps?q=Redwood+City+California&output=embed",
  },

  /* ---- WhatsApp booking --------------------------------------------------
     SAMPLE NUMBER — change this to the clinic's real WhatsApp number.
     International format, digits only, no "+", no spaces.
     e.g. US +1 415 555 0137 -> "14155550137"                               */
  whatsappNumber: "14155550137",

  /* ---- Social links ------------------------------------------------------ */
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/14155550137",
    x: "https://x.com",
  },

  /* ---- Services (6–8). Each card enters from a different direction. ------ */
  services: [
    { icon: "sparkle", title: "Preventive Care", desc: "Cleanings, exams & sealants that keep problems away." },
    { icon: "whiten", title: "Cosmetic Dentistry", desc: "Whitening, veneers & smile makeovers, tastefully done." },
    { icon: "implant", title: "Dental Implants", desc: "Permanent, natural-feeling replacements for lost teeth." },
    { icon: "align", title: "Orthodontics", desc: "Braces & clear aligners for quietly confident smiles." },
    { icon: "root", title: "Root Canal Therapy", desc: "Pain-free endodontics with modern rotary systems." },
    { icon: "kids", title: "Pediatric Dentistry", desc: "Gentle, playful visits that children look forward to." },
    { icon: "crown", title: "Crowns & Bridges", desc: "Durable, precisely-matched restorations in-house." },
    { icon: "emergency", title: "Emergency Care", desc: "Same-day relief when a tooth just can't wait." },
  ],

  /* ---- Treatment prices (at least 8). Realistic sample prices. ---------- */
  // Each treatment expands into an accordion. `price` is the "from" figure;
  // `range` is the fuller range; edit everything here in one place.
  prices: [
    {
      name: "Check-up & Cleaning", price: "$120", range: "$120 – $180",
      includes: ["Full oral exam", "Professional scale & polish", "Digital X-rays if needed", "Personalised home-care plan"],
      duration: "45 minutes", visits: "1 visit", aftercare: "Next recall in 6 months",
    },
    {
      name: "Teeth Whitening", price: "$450", range: "$450 – $650",
      includes: ["In-chair whitening session", "Custom-fit take-home trays", "Shade assessment", "Sensitivity care kit"],
      duration: "60–90 minutes", visits: "1–2 visits", aftercare: "Results last 12–24 months with care",
    },
    {
      name: "Dental Filling", price: "$180", range: "$180 – $320",
      includes: ["Tooth-coloured composite", "Decay removal", "Bite adjustment & polish"],
      duration: "30–45 minutes", visits: "1 visit", aftercare: "2-year workmanship warranty",
    },
    {
      name: "Root Canal", price: "$900", range: "$900 – $1,400",
      includes: ["Rotary endodontic treatment", "Local anaesthesia", "Temporary filling", "Crown recommendation"],
      duration: "60–90 minutes", visits: "1–2 visits", aftercare: "Crown advised within 4 weeks",
    },
    {
      name: "Dental Crown", price: "$1,200", range: "$1,200 – $1,800",
      includes: ["Digital 3D scan", "In-house milled ceramic crown", "Shade matching", "Fit & bite check"],
      duration: "1–2 hours", visits: "1–2 visits", aftercare: "5-year warranty on the crown",
    },
    {
      name: "Dental Implant", price: "$3,500", range: "$3,500 – $5,000",
      includes: ["Titanium implant placement", "Abutment & ceramic crown", "Guided 3D planning", "All follow-up reviews"],
      duration: "Staged over 3–6 months", visits: "3–4 visits", aftercare: "Lifetime implant guarantee*",
    },
    {
      name: "Braces (metal)", price: "$5,000", range: "$5,000 – $6,500",
      includes: ["Full fixed braces", "Monthly adjustments", "Retainers at completion", "Progress scans"],
      duration: "12–24 months", visits: "Monthly check-ins", aftercare: "Retainer & 6-month review",
    },
    {
      name: "Clear Aligners", price: "$4,500", range: "$4,500 – $6,000",
      includes: ["Full set of custom aligners", "3D treatment preview", "Refinements included", "Whitening on completion"],
      duration: "6–18 months", visits: "Every 6–8 weeks", aftercare: "Retainers & smile review",
    },
    {
      name: "Wisdom Tooth Removal", price: "$400", range: "$400 – $700 per tooth",
      includes: ["Surgical extraction", "Local or IV sedation", "Post-op care kit", "Follow-up review"],
      duration: "30–60 minutes", visits: "1 visit", aftercare: "7–10 day recovery, review included",
    },
    {
      name: "Kids Dentistry", price: "$90", range: "$90 – $160",
      includes: ["Gentle child exam", "Clean & fluoride", "Sealants if needed", "Fun, anxiety-free approach"],
      duration: "30 minutes", visits: "1 visit", aftercare: "6-month recall & tips",
    },
  ],
  pricesNote: "Prices are indicative. Final cost is confirmed after the consultation.",

  /* ---- "How it works" steps --------------------------------------------- */
  howItWorks: [
    { step: "01", title: "Book", desc: "Pick a time online or over WhatsApp — no queues, no waiting rooms." },
    { step: "02", title: "Visit", desc: "Relax in the studio while we scan, plan and talk you through everything." },
    { step: "03", title: "Smile", desc: "Leave with a plan that fits your life — and a smile you'll want to show off." },
  ],

  /* ---- Animated stats band (on Reviews) --------------------------------- */
  stats: [
    { value: 12000, suffix: "+", label: "Smiles cared for" },
    { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
    { value: 15, suffix: " yrs", label: "Of gentle care" },
    { value: 98, suffix: "%", label: "Would recommend" },
  ],

  /* ---- Doctors (exactly 3) — full "Choose Your Specialist" profiles -------
     photoKey = a key in src/assets-manifest.json (optimised portrait).
     All sample content — edit freely here.                                   */
  doctors: [
    {
      name: "Dr. James Whitaker", first: "James", speciality: "Implantologist", photoKey: "doctor-james",
      age: 42, experience: "14 yrs", inField: "14 yrs", atClinic: "7 yrs",
      qualification: "DDS, Prosthodontics", university: "NYU College of Dentistry",
      treatments: ["Dental implants", "Full-arch restoration", "Crowns & bridges"],
      patients: "4,200+", languages: ["English", "Spanish"],
      bio: "Rebuilds confident smiles with precise, natural-looking implant work.",
    },
    {
      name: "Dr. Emily Carter", first: "Emily", speciality: "Orthodontist", photoKey: "doctor-emily",
      age: 38, experience: "11 yrs", inField: "11 yrs", atClinic: "5 yrs",
      qualification: "DDS, MS Orthodontics", university: "University of Michigan",
      treatments: ["Clear aligners", "Braces", "Bite correction"],
      patients: "3,600+", languages: ["English", "French"],
      bio: "Straightens smiles quietly and comfortably, at any age.",
    },
    {
      name: "Dr. Sophia Bennett", first: "Sophia", speciality: "Pediatric Dentist", photoKey: "doctor-sophia",
      age: 44, experience: "12 yrs", inField: "12 yrs", atClinic: "8 yrs",
      qualification: "DDS, Pediatric Dentistry", university: "UCLA School of Dentistry",
      treatments: ["Kids check-ups", "Sealants & fluoride", "Gentle fillings"],
      patients: "5,100+", languages: ["English", "Portuguese"],
      bio: "Makes every child's visit calm, playful and completely fear-free.",
    },
  ],

  /* ---- Reviews ----------------------------------------------------------- */
  reviews: [
    { name: "Emma R.", stars: 5, text: "I used to dread the dentist. Lumina changed that completely — calm, painless, and genuinely kind." },
    { name: "Daniel K.", stars: 5, text: "Got my implant done here. The precision and aftercare were on another level. Zero complaints." },
    { name: "Olivia M.", stars: 5, text: "My kids actually ask to go back. The pediatric team is magic with nervous little ones." },
    { name: "Michael T.", stars: 4, text: "Whitening results were fantastic and the studio feels more like a spa than a clinic." },
    { name: "Grace L.", stars: 5, text: "Booked an emergency slot on a weekend and was seen within the hour. Lifesavers." },
    { name: "Ethan W.", stars: 5, text: "Clear aligners sorted in 9 months. Honest pricing, no upsell, brilliant results." },
  ],

  /* ---- Appointment form options ----------------------------------------- */
  treatments: [
    "Check-up & Cleaning", "Teeth Whitening", "Dental Filling", "Root Canal",
    "Dental Crown", "Dental Implant", "Braces", "Clear Aligners",
    "Wisdom Tooth Removal", "Kids Dentistry", "Not sure yet",
  ],
  // Time slots offered. `available: false` renders greyed-out / unclickable.
  timeSlots: [
    { label: "10:00", available: true },
    { label: "11:00", available: true },
    { label: "12:00", available: false },
    { label: "3:00", available: true },
    { label: "4:00", available: true },
    { label: "5:00", available: false },
  ],

  /* ---- 3D hero model -----------------------------------------------------
     Leave `glb` empty to use the built-in procedural tooth geometry.
     To swap in a downloaded model, drop the file in /public/assets/models/
     and set:  glb: "/assets/models/tooth.glb"                               */
  hero3d: {
    glb: "",
    glowColor: "#3FD0C0",
  },

  /* ---- Asset paths (swap placeholders here once your files arrive) ------- */
  assets: {
    images: {
      // doctor portraits, clinic photos, hero poster, etc.
      heroPoster: "/assets/images/hero-poster.jpg",
      clinic1: "/assets/images/clinic-1.jpg",
      clinic2: "/assets/images/clinic-2.jpg",
    },
    videos: {
      heroLoop: "/assets/videos/hero-loop.mp4",
      toothScrub: "/assets/videos/tooth-rotation.mp4",
    },
  },
};

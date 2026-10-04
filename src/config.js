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
  prices: [
    { name: "Check-up & Cleaning", price: "$120" },
    { name: "Teeth Whitening", price: "$450" },
    { name: "Dental Filling", price: "$180" },
    { name: "Root Canal", price: "$900" },
    { name: "Dental Crown", price: "$1,200" },
    { name: "Dental Implant", price: "$3,500" },
    { name: "Braces (metal)", price: "$5,000" },
    { name: "Clear Aligners", price: "$4,500" },
    { name: "Wisdom Tooth Removal", price: "$400" },
    { name: "Kids Dentistry", price: "$90" },
  ],
  pricesNote: "Prices are indicative. Final cost is confirmed after the consultation.",

  /* ---- Doctors (4) ------------------------------------------------------- */
  doctors: [
    // photoKey = a key in src/assets-manifest.json (optimised portrait). Leave
    // empty to show the elegant initials avatar instead.
    { name: "Dr. James Whitaker", speciality: "Implantologist", qualification: "DDS, Prosthodontics", experience: "14 years", photoKey: "doctor-james" },
    { name: "Dr. Emily Carter", speciality: "Orthodontist", qualification: "DDS, MS Orthodontics", experience: "11 years", photoKey: "doctor-emily" },
    { name: "Dr. Sophia Bennett", speciality: "Pediatric Dentist", qualification: "DDS, Pediatric Dentistry", experience: "12 years", photoKey: "doctor-sophia" },
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

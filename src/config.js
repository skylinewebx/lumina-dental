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
    phoneDisplay: "+91 98765 43210",
    phoneHref: "tel:+919876543210",
    email: "hello@luminadental.care",
    address: "2nd Floor, Marine Arcade, Linking Road, Bandra West, Mumbai 400050",
    hours: [
      { day: "Mon – Fri", time: "9:00 AM – 8:00 PM" },
      { day: "Saturday", time: "9:00 AM – 5:00 PM" },
      { day: "Sunday", time: "Emergencies only" },
    ],
    // Any sample location works — this is a demo.
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3!2d72.8296!3d19.0607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9!2sBandra%20West!5e0!3m2!1sen!2sin!4v1700000000000",
  },

  /* ---- WhatsApp booking --------------------------------------------------
     IMPORTANT: put the full number in international format, digits only,
     no "+", no spaces. e.g. India 98765 43210 -> "919876543210"           */
  whatsappNumber: "919876543210",

  /* ---- Social links ------------------------------------------------------ */
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/919876543210",
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
    { name: "Check-up & Cleaning", price: "₹1,200" },
    { name: "Teeth Whitening", price: "₹8,500" },
    { name: "Dental Filling", price: "₹2,000" },
    { name: "Root Canal", price: "₹6,500" },
    { name: "Dental Crown", price: "₹9,000" },
    { name: "Dental Implant", price: "₹35,000" },
    { name: "Braces (metal)", price: "₹45,000" },
    { name: "Clear Aligners", price: "₹1,10,000" },
    { name: "Wisdom Tooth Removal", price: "₹7,500" },
    { name: "Kids Dentistry", price: "₹1,500" },
  ],
  pricesNote: "Prices are indicative. Final cost is confirmed after the consultation.",

  /* ---- Doctors (4) ------------------------------------------------------- */
  doctors: [
    // photoKey = a key in src/assets-manifest.json (optimised portrait). Leave
    // empty to show the elegant initials avatar instead.
    { name: "Dr. Aarav Mehta", speciality: "Implantologist", qualification: "BDS, MDS (Prosthodontics)", experience: "14 years", photoKey: "doctor-aarav" },
    { name: "Dr. Nisha Kapoor", speciality: "Orthodontist", qualification: "BDS, MDS (Orthodontics)", experience: "11 years", photoKey: "" },
    { name: "Dr. Rohan Verma", speciality: "Endodontist", qualification: "BDS, MDS (Endodontics)", experience: "9 years", photoKey: "" },
    { name: "Dr. Sara Pinto", speciality: "Pediatric Dentist", qualification: "BDS, MDS (Pedodontics)", experience: "8 years", photoKey: "" },
  ],

  /* ---- Reviews ----------------------------------------------------------- */
  reviews: [
    { name: "Priya S.", stars: 5, text: "I used to dread the dentist. Lumina changed that completely — calm, painless, and genuinely kind." },
    { name: "Karan D.", stars: 5, text: "Got my implant done here. The precision and aftercare were on another level. Zero complaints." },
    { name: "Meera J.", stars: 5, text: "My kids actually ask to go back. The pediatric team is magic with nervous little ones." },
    { name: "Aditya R.", stars: 4, text: "Whitening results were fantastic and the studio feels more like a spa than a clinic." },
    { name: "Fatima N.", stars: 5, text: "Booked an emergency slot on a Sunday and was seen within the hour. Lifesavers." },
    { name: "Vikram T.", stars: 5, text: "Clear aligners sorted in 9 months. Honest pricing, no upsell, brilliant results." },
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

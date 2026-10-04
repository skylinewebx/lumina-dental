/* =============================================================================
   APPOINTMENT FORM
   - Date picker with no past dates; auto-fills the weekday from the date.
   - Time slots as clickable chips (unavailable ones greyed out).
   - Validates, shows an animated success state, then opens WhatsApp with the
     booking details pre-filled (number comes from CONFIG.whatsappNumber).
   ========================================================================== */
import { CONFIG } from "../config.js";

export function initForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const dateInput = document.getElementById("date");
  const dayInput = document.getElementById("day");
  const slotsWrap = document.getElementById("slots");
  const errorEl = document.getElementById("formError");
  const success = document.getElementById("bookingSuccess");

  /* ---- Populate selects ---- */
  const treatmentSel = document.getElementById("treatment");
  treatmentSel.innerHTML =
    '<option value="" disabled selected>Choose a treatment</option>' +
    CONFIG.treatments.map((t) => `<option>${t}</option>`).join("");

  const doctorSel = document.getElementById("doctor");
  doctorSel.innerHTML =
    '<option value="" selected>No preference</option>' +
    CONFIG.doctors.map((d) => `<option>${d.name} — ${d.speciality}</option>`).join("");

  /* ---- Date: minimum = today; derive weekday ---- */
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { dayInput.value = ""; return; }
    // Parse as local date to avoid timezone drift.
    const [y, m, d] = dateInput.value.split("-").map(Number);
    dayInput.value = DAYS[new Date(y, m - 1, d).getDay()];
  });

  /* ---- Time slot chips ---- */
  let selectedSlot = "";
  slotsWrap.innerHTML = CONFIG.timeSlots
    .map(
      (s) =>
        `<button type="button" class="slot" data-slot="${s.label}" ${s.available ? "" : "disabled aria-disabled='true'"}>${s.label}</button>`
    )
    .join("");
  slotsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".slot");
    if (!btn || btn.disabled) return;
    slotsWrap.querySelectorAll(".slot").forEach((s) => s.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    selectedSlot = btn.dataset.slot;
    errorEl.textContent = "";
  });

  /* ---- Submit ---- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const data = {
      name: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      treatment: form.treatment.value,
      doctor: form.doctor.value || "No preference",
      date: dateInput.value,
      day: dayInput.value,
      slot: selectedSlot,
      message: form.message.value.trim(),
    };

    // Validation
    if (!data.name) return fail("Please enter your name.");
    if (!/^[+\d][\d\s-]{6,}$/.test(data.phone)) return fail("Please enter a valid phone number.");
    if (!data.treatment) return fail("Please choose a treatment.");
    if (!data.date) return fail("Please pick a preferred date.");
    if (!selectedSlot) return fail("Please choose a time slot.");

    // Build WhatsApp message
    const lines = [
      `*New appointment request — ${CONFIG.clinic.name}*`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      `Treatment: ${data.treatment}`,
      `Doctor: ${data.doctor}`,
      `Date: ${data.date} (${data.day})`,
      `Time: ${data.slot}`,
      data.message ? `Message: ${data.message}` : null,
    ].filter(Boolean);
    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

    // Animated success state, then open WhatsApp.
    success.classList.add("is-open");
    success.setAttribute("aria-hidden", "false");
    setTimeout(() => window.open(waUrl, "_blank", "noopener"), 1100);

    function reset() {
      form.reset();
      dayInput.value = "";
      selectedSlot = "";
      slotsWrap.querySelectorAll(".slot").forEach((s) => s.classList.remove("is-selected"));
    }
    document.getElementById("successClose").onclick = () => {
      success.classList.remove("is-open");
      success.setAttribute("aria-hidden", "true");
      reset();
    };
  });

  function fail(msg) {
    errorEl.textContent = msg;
  }
}

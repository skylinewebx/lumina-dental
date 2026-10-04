/* =============================================================================
   THEME TOGGLE
   Light/Dark with a smooth colour transition (handled by CSS --t-theme).
   Remembers the choice in localStorage; respects the OS preference first time.
   ========================================================================== */
const KEY = "lumina-theme";

export function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  // Initial theme: the user's remembered choice, otherwise dark by default.
  const saved = localStorage.getItem(KEY);
  const initial = saved === "light" ? "light" : "dark";
  root.setAttribute("data-theme", initial);

  toggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
  });
}

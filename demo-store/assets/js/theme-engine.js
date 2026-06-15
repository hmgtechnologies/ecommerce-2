/* ============================================================================
 * HMG StoreForge v9 — Theme & Layout Engine (theme-engine.js)
 * ----------------------------------------------------------------------------
 * Applies the per-store DESIGN choices made in the generator's Customization
 * Studio: fonts, colours, corner radius, layout style, hero style, product-card
 * style, button shape, and density. Also enforces FEATURE TOGGLES (cfg.features)
 * so disabled sections are hidden.
 *
 * Runs FIRST (before store.js) so styles are set before content renders.
 * 100% free, no external libraries. Google Fonts are loaded only if chosen.
 * ==========================================================================*/
(function () {
  const cfg = window.STORE_CONFIG || {};
  const d = cfg.design || {};
  const root = document.documentElement;

  /* ---------- Fonts ---------- */
  // Free, widely available font stacks + optional Google Fonts (loaded on demand).
  const FONTS = {
    system: { stack: "system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif", google: "" },
    inter: { stack: "'Inter',system-ui,sans-serif", google: "Inter:wght@400;600;800" },
    poppins: { stack: "'Poppins',system-ui,sans-serif", google: "Poppins:wght@400;600;700" },
    montserrat: { stack: "'Montserrat',system-ui,sans-serif", google: "Montserrat:wght@400;600;800" },
    nunito: { stack: "'Nunito',system-ui,sans-serif", google: "Nunito:wght@400;600;800" },
    lora: { stack: "'Lora',Georgia,serif", google: "Lora:wght@400;600;700" },
    playfair: { stack: "'Playfair Display',Georgia,serif", google: "Playfair+Display:wght@500;700" },
    spacegrotesk: { stack: "'Space Grotesk',system-ui,sans-serif", google: "Space+Grotesk:wght@400;600;700" }
  };
  function loadFont(key) {
    const f = FONTS[key] || FONTS.system;
    if (f.google) {
      const l = document.createElement("link"); l.rel = "stylesheet";
      l.href = `https://fonts.googleapis.com/css2?family=${f.google}&display=swap`;
      document.head.appendChild(l);
    }
    return f.stack;
  }

  const bodyFont = loadFont(d.font || "system");
  const headingFont = d.headingFont && d.headingFont !== (d.font || "system") ? loadFont(d.headingFont) : bodyFont;
  root.style.setProperty("--font-body", bodyFont);
  root.style.setProperty("--font-head", headingFont);

  /* ---------- Colours (from cfg.theme, already handled by store.js too) ---------- */
  if (cfg.theme) for (const k in cfg.theme) root.style.setProperty("--" + k, cfg.theme[k]);

  /* ---------- Corner radius / roundness ---------- */
  const radiusMap = { sharp: "2px", soft: "10px", rounded: "16px", pill: "24px" };
  root.style.setProperty("--radius", radiusMap[d.radius] || "14px");

  /* ---------- Density (spacing) ---------- */
  const densityMap = { compact: "0.85", cozy: "1", spacious: "1.2" };
  root.style.setProperty("--density", densityMap[d.density] || "1");

  /* ---------- Button shape ---------- */
  const btnRadius = { square: "4px", rounded: "10px", pill: "999px" };
  root.style.setProperty("--btn-radius", btnRadius[d.buttonShape] || "var(--radius)");

  /* ---------- Layout / style flags as body classes ---------- */
  const cls = [];
  cls.push("layout-" + (d.layout || "classic"));        // classic | grid | magazine | minimal
  cls.push("hero-" + (d.hero || "split"));               // split | banner | centered | slideshow | none
  cls.push("card-" + (d.cardStyle || "shadow"));         // shadow | border | flat | overlay
  cls.push("ui-" + (d.uiStyle || "standard"));           // standard | glass | neumorph | bold
  if (d.darkDefault) root.setAttribute("data-theme", "dark");
  document.addEventListener("DOMContentLoaded", () => { document.body.classList.add(...cls); applyFeatureToggles(); });

  /* ---------- FEATURE TOGGLES: hide sections turned off in cfg.features ---------- */
  function applyFeatureToggles() {
    const F = cfg.features || {};
    const map = {
      testimonials: "#testimonialSection",
      faq: "#faqSection",
      vendors: "#vendorSection",
      newsletter: ".newsletter-section",
      recentlyViewed: "#recentSection",
      trustBadges: ".trust-section",
      about: "#about",
      contact: "#contact",
      categories: "#categories",
      search: ".toolbar"
    };
    for (const key in map) {
      if (F[key] === false) { const el = document.querySelector(map[key]); if (el) el.style.display = "none"; }
    }
    // header buttons
    if (F.wishlist === false) hide("#wishBtn");
    if (F.darkMode === false) hide("#themeToggle");
    if (F.languages === false) hide("#langSwitch");
    if (F.loyalty === false) hide("#loyaltyBadge");
    if (F.accounts === false) hide("#accountBtn");
    if (F.notifications === false) hide("#notifBtn");
  }
  function hide(sel) { const e = document.querySelector(sel); if (e) e.style.display = "none"; }
})();

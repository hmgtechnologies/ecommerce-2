# ♿ Accessibility & Performance (WCAG / Lighthouse)

HMG StoreForge stores are built to be **accessible** and **fast** — good for users, and good for SEO
(Google rewards accessible, fast, mobile-friendly sites). This is all free.

---

## What's built in
- **Skip-to-content link** (keyboard users jump past the header).
- **Visible focus outlines** on all interactive elements (`:focus-visible`).
- **Semantic landmarks**: `<header>`, `<nav>`, `<main>`-style sections, `<footer>`.
- **ARIA labels** on icon buttons (cart, wishlist, theme, menu, close).
- **Image `alt` text** on product and brand images.
- **Language switching** updates `<html lang>` (English, Pidgin, Hausa, Yoruba, Igbo).
- **Reduced-motion support** — animations disabled for users who prefer it.
- **Responsive + mobile-first** layout; large tap targets.
- **Fast**: system fonts by default; Google Fonts use `display=swap`; images lazy-load; tiny JS/CSS;
  PWA caching; no heavy frameworks; no AI/analytics unless you enable them.
- **Colour contrast**: presets chosen for readable contrast; dark mode available.

---

## Run a free Lighthouse / accessibility report
1. Open the deployed store in **Google Chrome**.
2. Right-click → **Inspect** → open the **Lighthouse** tab (or menu ⋮ → More tools → Developer tools).
3. Tick **Performance, Accessibility, Best Practices, SEO, PWA** → **Analyze page load**.
4. Review scores and suggestions. (StoreForge stores typically score high on Accessibility, SEO and PWA.)

Other free tools:
- **WAVE** — https://wave.webaim.org (paste your URL) for accessibility issues.
- **PageSpeed Insights** — https://pagespeed.web.dev for mobile/desktop performance.

---

## Tips to keep scores high
- Use **descriptive product names & descriptions** (helps screen readers + SEO).
- Upload **clear images** sized ~1000px (not 5MB photos) — use the admin's Google Drive links.
- Pick **high-contrast colours** for text vs background (the presets are safe).
- Keep enabled **only the features you need** (Feature Selection) so pages stay light.
- Always serve over **HTTPS** (Cloudflare/GitHub Pages do this free) — required for PWA + trust.

---

## WCAG quick checklist
- [ ] All images have meaningful `alt` (set product names well)
- [ ] Sufficient colour contrast (use presets or test in Lighthouse)
- [ ] Keyboard navigable (Tab through the page; focus is visible)
- [ ] Skip link works (Tab once on load)
- [ ] Language set correctly via the switcher
- [ ] Forms have labels (checkout, account, Q&A — built in)
- [ ] Reduced motion respected (built in)

💬 Need an accessibility review? WhatsApp HMG Technologies: https://wa.me/2348100866322

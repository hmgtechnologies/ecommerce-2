# 🎨 Customization Studio — Design Each Client's Store

v9 lets you tailor **features, layout, UI/UX, fonts, and colours** for every client — with a **live
preview** in the generator. This guide explains every option and how to set it (via the generator UI,
or by hand in `assets/js/config.js → design / features`).

> Everything here is free. Google Fonts load only when chosen; nothing else is added.

---

## A) Using the generator (easiest)
1. Open `generator/index.html`.
2. Fill the client's basics (name, WhatsApp, etc.).
3. In **4️⃣ Brand Colours**, click a **preset** (HMG, Emerald, Royal, Sunset, Rose, Mono, Ocean, Naija)
   or pick custom Primary/Accent/Secondary colours.
4. In **🎨 Customization Studio**, choose fonts, layout, hero, card style, UI style, roundness, button
   shape, density, and dark-mode default — watch the **live preview** update on the right.
5. In **✅ Feature Selection**, tick only the features this client needs.
6. Generate (ZIP) or one-click deploy.

---

## B) Every option explained

### Fonts (body & heading)
`system` (fastest, no download), `inter`, `poppins`, `montserrat`, `nunito` (clean sans-serifs),
`lora`, `playfair` (elegant serifs), `spacegrotesk` (modern/techy). Heading can differ from body.

### Layout
- **classic** — standard responsive grid + hero.
- **grid** — compact, more products per row (good for big catalogs).
- **magazine** — first product shown large/featured.
- **minimal** — airy, badge-free, borderless (premium/boutique feel).

### Hero style
- **split** — image beside headline (default).
- **banner** — full-width gradient banner, centered text.
- **centered** — narrow centered intro.
- **none** — no hero (jump straight to products).

### Product-card style
- **shadow** (default), **border**, **flat** (no card chrome), **overlay** (text over the image —
  great for fashion/lookbooks).

### UI style
- **standard**, **glass** (frosted glassmorphism), **neumorph** (soft shadows), **bold** (brutalist,
  thick borders + hard shadows).

### Roundness / button shape / density
- **radius:** sharp → soft → rounded → pill (corner roundness everywhere).
- **buttonShape:** square / rounded / pill.
- **density:** compact / cozy / spacious (controls section spacing).

### Dark mode default
Start the store in dark mode (`darkDefault: true`). Customers can still toggle.

---

## C) Setting it by hand (config.js)
```js
design: {
  font: "poppins", headingFont: "montserrat",
  layout: "magazine", hero: "banner",
  cardStyle: "overlay", uiStyle: "glass",
  radius: "rounded", buttonShape: "pill",
  density: "spacious", darkDefault: false
},
features: {
  wishlist: true, reviews: true, qa: true, testimonials: false, faq: true,
  newsletter: true, recentlyViewed: true, trustBadges: true, vendors: false,
  about: true, contact: true, darkMode: true, languages: true,
  loyalty: false, accounts: true, notifications: true
}
```
Re-upload `config.js` (or redeploy) and the look updates instantly.

---

## D) Tips by industry
- **Fashion/beauty:** `cardStyle: overlay`, `font: playfair/montserrat`, `layout: magazine`.
- **Electronics/gadgets:** `font: spacegrotesk/inter`, `uiStyle: bold`, `layout: grid`.
- **Food/groceries:** `font: nunito/poppins`, `radius: rounded`, warm colour preset.
- **Premium/boutique:** `layout: minimal`, `uiStyle: glass`, lots of `density: spacious`.

💬 Need a bespoke design? WhatsApp HMG Technologies: https://wa.me/2348100866322

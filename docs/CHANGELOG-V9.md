# 🆕 HMG StoreForge v9 — What's New (Detailed)

v9 builds on v1–v8. **Every earlier feature is preserved** — v9 only *adds*. All additions use
**free tools only — no paid AI APIs.**

Headline additions you asked for:
1. **Customization Studio** — select **features, layouts, UI/UX, fonts, colours** per client.
2. **Stronger lead generation** — **your HMG brand embedded on every client store** to drive their
   users back to you.
3. **Product Q&A**, **abandoned-cart email recovery**, and an **accessibility (WCAG/Lighthouse) pass**.

---

## 1) 🎨 Customization Studio — design each client's store

In the generator, a new **Customization Studio** lets you choose, with a **live preview**:

| Choice | Options |
|--------|---------|
| **Body / Heading font** | System, Inter, Poppins, Montserrat, Nunito, Lora, Playfair, Space Grotesk (free Google Fonts, loaded only if chosen) |
| **Layout** | Classic · Compact grid · Magazine (big featured) · Minimal |
| **Hero style** | Split (image+text) · Full banner · Centered · None |
| **Product-card style** | Shadow · Bordered · Flat · Image overlay |
| **UI style** | Standard · Glassmorphism · Neumorphism · Bold/Brutalist |
| **Corner roundness** | Sharp · Soft · Rounded · Pill |
| **Button shape** | Square · Rounded · Pill |
| **Spacing density** | Compact · Cozy · Spacious |
| **Dark mode default** | On/off |
| **Colour presets** | HMG, Emerald, Royal, Sunset, Rose, Mono, Ocean, Naija — or pick custom colours |

- **Where:** `store-template/assets/js/theme-engine.js` (applies the choices) + `assets/css/themes.css`
  (the visual variants) + the **Customization Studio** + **colour presets** in `generator/index.html`.
- **Config:** stored in `cfg.design` (see `config.js`). The engine sets CSS variables and body classes
  before render, so the whole store adopts the look instantly.
- **Why:** every client gets a distinct, on-brand store — no two have to look alike.

### ✅ Feature Selection
A **Feature Selection** panel (and `cfg.features`) lets you turn sections on/off per client: wishlist,
reviews, Q&A, testimonials, FAQ, newsletter, recently-viewed, trust badges, dark-mode toggle,
loyalty, accounts, notifications. Disabled sections are hidden automatically by `theme-engine.js`.

---

## 2) 🚀 Lead generation — your brand on every client store

Your **HMG details are embedded into every generated store** (read from `generator/assets/js/brand.js`
into each store's `cfg.leadGen`):
- The footer now reads **"⚡ Built by HMG Technologies · Adewale Samson Adeagbo · Get your own store 💬"**
  linking to your site and a **pre-filled WhatsApp** message that names the client store.
- A subtle **floating lead-gen badge** ("🚀 Want a store like this? Chat HMG Technologies") appears
  bottom-left on desktop, linking to your WhatsApp. *(Toggle with `cfg.leadGen.badge`.)*
- Every shopper on every client store becomes a potential lead for you — automatically.
- **Where:** `store.js` (footer + badge), `cfg.leadGen`, sourced from `brand.js`.

> Update your details **once** in `generator/assets/js/brand.js` and they propagate to every new store.

---

## 3) ❓ Product Q&A

- Customers ask questions on a product; the question is **sent to your WhatsApp** to answer and stored
  on the page. *(store-extras8.js + modal hook in store.js; toggle via `features.qa`.)*

## 4) 💌 Abandoned-cart email recovery (free)

- When a cart has items, a polite bar offers a discount for the customer's email. If the cart is later
  abandoned, a **recovery email** is sent via **free Formspree**. *(store-extras8.js; `cfg.recovery`.)*

## 5) ♿ Accessibility & performance pass (WCAG / Lighthouse)

- **Skip-to-content** link, visible **focus outlines**, semantic landmarks, `aria-label`s, image
  `alt`s, `lang` switching, reduced-motion support, lazy images, system/Google fonts with
  `display=swap`. See **[`ACCESSIBILITY.md`](ACCESSIBILITY.md)** for the audit checklist and how to run
  a free Lighthouse report.

---

## 6) New files in v9
```
store-template/assets/js/theme-engine.js     applies design choices + feature toggles
store-template/assets/css/themes.css          layout/UI/card style variants
store-template/assets/js/store-extras8.js     product Q&A + cart-recovery + reveal anim
docs/CUSTOMIZATION-STUDIO.md                   how to design a client store
docs/ACCESSIBILITY.md                          WCAG/Lighthouse checklist
docs/CHANGELOG-V9.md                           this file
```
(plus enhanced generator Studio + presets + feature panel, lead-gen footer/badge, config, CLI.)

---

## 7) Nothing removed
Every v1–v8 capability remains intact (full catalog/cart/WhatsApp ordering, both payment methods,
Supabase/JSON, Google Drive images, wishlist, reviews, variants, coupons, delivery zones, order
tracking, PWA install + offline, bulk CSV, dashboards, store hours, FAQ, testimonials, multi-currency,
returns, receipts, Google Sheets logging, loyalty, flash sale, social proof, comparison, trust badges,
multi-vendor marketplace + order splitting + payouts, gift cards, referrals, WhatsApp auto-reply,
vendor self-service dashboard, dispatch/riders, push notifications, QR, sales targets, buyer accounts,
subscriptions, 5-language i18n, offline queue, SEO/sitemap, one-click GitHub deploy, fully-populated
demo, ZIP + CLI generation). v9 is strictly additive.

💬 Questions? WhatsApp HMG Technologies: https://wa.me/2348100866322

# 🆕 HMG StoreForge v3 — What's New (Detailed)

v3 builds on v1 + v2. **Every earlier feature is preserved** — v3 only *adds*. This document explains
each new feature: what it does, why it matters, how to configure it, and where it lives. All additions
use **free tools only — no paid AI APIs.**

The three headline additions you asked for:
1. **A fully-populated demo store** (`demo-store/`) — see every feature instantly.
2. **One-click direct GitHub deployment** from the generator — no manual uploads.
3. **More enterprise features** (below).

---

## 1) Fully-populated DEMO STORE (`demo-store/`)

- A complete, deployable store named **"Naija Mart (Demo)"** with **12 real products** (with photos)
  across Fashion, Electronics, Beauty, Groceries, Home.
- Live **coupons** (`WELCOME10`, `SAVE2000`, `BIG15`), **delivery zones**, **store hours**, **FAQ**,
  **testimonials**, **multi-currency**, variants, galleries, low-stock items, and an out-of-stock item.
- **How to view:** open `demo-store/index.html` in a browser, or deploy the folder to Cloudflare/GitHub
  Pages. Admin at `demo-store/admin.html` (passcode `admin1234`).
- **Why:** instantly demonstrates the platform to you and to prospective clients — a powerful sales tool.

---

## 2) One-Click Direct GitHub Deployment

- In the generator (`generator/index.html`), the new **"🚀 One-Click Deploy to GitHub"** panel lets you
  paste a **GitHub Personal Access Token** and deploy a store directly: it **creates the repository**,
  **pushes every file**, and **enables GitHub Pages** — then shows the live URL. No ZIP, no manual upload.
- **Where:** `generator/assets/js/github-deploy.js` (uses the free GitHub REST API entirely in your
  browser) + deploy handler in `generator/assets/js/generator.js`.
- **Security:** the token is used only in your browser to call `api.github.com`; it is never stored or
  sent anywhere else. Use a fine-scoped token with `repo` scope.
- **Full steps:** see [`GITHUB-DEPLOY.md`](GITHUB-DEPLOY.md).
- **Why:** turns a 10-minute manual process into ~30 seconds. Generate dozens of client stores fast.

---

## 3) New ENTERPRISE storefront features

### 3.1 Store open/closed indicator ⏰
- **What:** A live "Open now · until 20:00" / "Closed · opens 08:00" badge based on business hours.
- **Where:** `store-extras2.js` (`isOpenNow`), `#storeHours` in the toolbar.
- **Config (config.js):**
  ```js
  hours: { enabled: true, timezone: "Africa/Lagos",
    schedule: { mon:["08:00","20:00"], /* ...per day... */ sun:["12:00","18:00"] } }
  ```

### 3.2 FAQ accordion ❓
- **What:** Expandable FAQ section.
- **Config:** `faq: [{ q: "...", a: "..." }, ...]`.

### 3.3 Testimonials 💬
- **What:** Customer testimonial cards with star ratings.
- **Config:** `testimonials: [{ name, text, rating }, ...]`.

### 3.4 Multi-currency display 💱
- **What:** A NGN/USD/GBP switcher; shows an approximate converted price under each NGN price
  (informational — orders remain in your base currency).
- **Where:** `store-extras2.js` (`convert`, `annotatePrices`), `#currencySwitch`.
- **Config:**
  ```js
  currencies: { base:"NGN", rates:{ NGN:1, USD:0.00067, GBP:0.00053 },
                symbols:{ NGN:"₦", USD:"$", GBP:"£" } }
  ```

### 3.5 Price-range filter 🎚️
- **What:** Min/Max price inputs filter the visible products.
- **Where:** `store-extras2.js` (`bindPriceFilter`), price filter UI in `index.html`.

### 3.6 Coupon auto-apply via URL 🔗
- **What:** Share a link like `yourstore.pages.dev/?coupon=WELCOME10` — the code auto-fills at checkout.
- **Where:** `store-extras2.js` (`autoCoupon`) + checkout hook in `store.js`.
- **Why:** great for marketing campaigns and influencer links.

### 3.7 Returns / Refund policy ↩️
- **What:** A "Returns Policy" button opens a modal with your policy + a WhatsApp "start a return" CTA.
- **Config:** `returnsPolicy: "Your policy text..."`.

### 3.8 Printable receipts 🧾
- **What:** After ordering, the customer can print/save a clean receipt. Admins can reprint, too.
- **Where:** `store-extras2.js` (`printReceipt`).

### 3.9 Customer memory (lightweight account) 👤
- **What:** Remembers the customer's name & phone for faster repeat checkout (localStorage; no login).
- **Where:** `store-extras2.js` (`Account`) + checkout hooks in `store.js`.

### 3.10 WhatsApp catalog export 📤
- **What:** A "Share Catalog" button shares your product list via WhatsApp.
- **Where:** `store-extras2.js` (`shareCatalog`), button in the FAQ section.

---

## 4) New files in v3

```
demo-store/                              ← fully-populated demo store (deployable)
  index.html, admin.html, track.html, products.json, config.js, ...
  assets/images/products/*.jpg           ← 10 real product photos
store-template/assets/js/store-extras2.js ← all v3 storefront logic
store-template/assets/css/extras.css      ← (appended) v3 styles
generator/assets/js/github-deploy.js      ← GitHub REST API deploy module
docs/CHANGELOG-V3.md                       ← this file
docs/GITHUB-DEPLOY.md                      ← step-by-step token + deploy guide
```
(plus enhanced `index.html`, `store.js`, `config.js`, generator files)

---

## 5) Nothing removed
Every v1 and v2 capability remains fully intact (catalog, search, cart, WhatsApp ordering, both
payment methods, Supabase/JSON fallback, Google Drive images, dark mode, SEO, wishlist, reviews,
variants, coupons, delivery zones, order tracking, PWA, bulk CSV, dashboard, ZIP & CLI generation,
HMG lead-gen footer). v3 is strictly additive.

💬 Questions? WhatsApp HMG Technologies: https://wa.me/2348100866322

# 🆕 HMG StoreForge v4 — What's New (Detailed)

v4 builds on v1 + v2 + v3. **Every earlier feature is preserved** — v4 only *adds*. All additions use
**free tools only — no paid AI APIs.**

The headline additions you asked for:
1. **The 2 remaining demo product images** (blender, soap) — the demo store is now 100% photographed.
2. **Bank-grade Google Sheets order export** (free, no API key) — every order logged to a spreadsheet.
3. **More enterprise features** (below).

---

## 1) Demo store fully photographed
- `demo-store/assets/images/products/blender.jpg` and `soap.jpg` added.
- Both demo products are now in stock with real photos; the blender is featured with a SALE price.
- The demo (`demo-store/`) now showcases **every** feature with real imagery — a polished sales tool.

---

## 2) Google Sheets Order Logging (free, no API key) 📊

- **What:** Every order placed on the store is logged as a row in a **Google Sheet** (customer, items,
  totals, address, payment, status), and you can optionally get an **email per order**.
- **Why:** A free, shareable, bank-grade order book — sort, filter, hand to staff, no database needed.
  Orders still go to WhatsApp and on-device history too; this is *in addition*.
- **How it works:** the store POSTs each order (JSON) to a **Google Apps Script Web App** URL you own.
- **Where:** `integrations/google-sheets-orders.gs` (the Apps Script) + `store-extras3.js`
  (`logOrderToSheets`) + a `sf:order` event dispatched from `store.js`.
- **Setup:** full step-by-step in **[`../integrations/GOOGLE-SHEETS-SETUP.md`](../integrations/GOOGLE-SHEETS-SETUP.md)**.
- **Config (config.js):**
  ```js
  orders: {
    sheetsWebAppUrl: "https://script.google.com/macros/s/XXXX/exec",
    alsoEmailFormspreeId: ""   // optional email backup via Formspree
  }
  ```
  Or paste the URL in the generator's new **section 9️⃣ Orders, Loyalty & Engagement**.

---

## 3) New ENTERPRISE features

### 3.1 Loyalty points ⭐
- **What:** Customers earn points per order (default 1 point per ₦1,000), shown in the header. Encourages
  repeat purchases; they mention points at checkout to redeem (your policy).
- **Where:** `store-extras3.js` (`Loyalty`). **Config:** `loyalty: { enabled: true, pointsPerNaira: 0.001 }`.

### 3.2 Flash-sale countdown ⚡
- **What:** A live countdown bar (days/hours/mins/secs) at the top, creating urgency.
- **Config:** `flashSale: { enabled: true, title: "...", endsAt: "2026-07-01T23:59:59" }`.

### 3.3 Recently-sold social proof 🛍️
- **What:** Periodic toasts like *"Chioma from Lagos just bought Wireless Earbuds"* (using your real
  products + Nigerian names/cities). Builds trust and FOMO.
- **Config:** `socialProof: { enabled: true }`.

### 3.4 Product comparison ⚖️
- **What:** Add up to 4 products to a comparison table (image, price, category, stock, add-to-cart).
- **Where:** `store-extras3.js` (`Compare`), ⚖️ button on cards + a floating "Compare (N)" button.

### 3.5 Trust badges 🛡️
- **What:** A reassurance strip (Fast Delivery, Secure Payment, Easy Returns, Real Support). Customisable.
- **Config:** `trustBadges: [{ icon, title, text }]` (sensible defaults if empty).

### 3.6 "Notify me when back in stock" 🔔
- **What:** Out-of-stock products show a **🔔 Notify me** button; the customer leaves a contact and the
  request is also sent to you on WhatsApp.
- **Where:** `store-extras3.js` (`notifyBackInStock`).

### 3.7 Estimated delivery date 🚚
- **What:** Checkout shows "Estimated delivery by <date>" based on `delivery.estimatedDays`.

### 3.8 Language switcher (English / Nigerian Pidgin) 🌍
- **What:** A light EN/Pidgin toggle for key labels — friendlier for local audiences.
- **Config:** `languages: { enabled: true }`. (Scaffold; extend the dictionary in `store-extras3.js`.)

---

## 4) New files in v4
```
integrations/google-sheets-orders.gs       Apps Script for Google Sheets logging
integrations/GOOGLE-SHEETS-SETUP.md         step-by-step setup
store-template/assets/js/store-extras3.js   all v4 storefront logic
demo-store/assets/images/products/blender.jpg, soap.jpg   final demo photos
docs/CHANGELOG-V4.md                         this file
```
(plus enhanced `index.html`, `store.js`, `config.js`, generator files)

---

## 5) Nothing removed
Every v1/v2/v3 capability remains intact (catalog, search, cart, WhatsApp ordering, both payment
methods, Supabase/JSON, Google Drive images, wishlist, reviews, variants, coupons, delivery zones,
order tracking, PWA, bulk CSV, dashboard, store hours, FAQ, testimonials, multi-currency, returns,
printable receipts, one-click GitHub deploy, ZIP & CLI generation, HMG lead-gen footer). v4 is
strictly additive.

💬 Questions? WhatsApp HMG Technologies: https://wa.me/2348100866322

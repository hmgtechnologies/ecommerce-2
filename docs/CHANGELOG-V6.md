# 🆕 HMG StoreForge v6 — What's New (Detailed)

v6 builds on v1–v5. **Every earlier feature is preserved** — v6 only *adds*. All additions use
**free tools only — no paid AI APIs.**

The headline additions you asked for:
1. **Vendor self-service dashboard** — each vendor manages their own products & orders.
2. **Delivery / dispatch rider assignment** — assign orders to riders, packing slips.
3. **PWA push / browser notifications** — free native order alerts.

Plus extras: **store QR code generator** and a **monthly sales-target widget**.

---

## 1) Vendor Self-Service Dashboard 🏪 (`vendor.html`)

- **What:** A vendor logs in with their **vendor code** (e.g. `v1`) and manages **only their own**
  products — add/edit/delete, set price/qty/images/variants — and sees **their own orders, revenue,
  units sold, and low-stock** stats.
- **Publish:** vendors **download their `v1-products.json`** and send it to the marketplace admin to
  merge (or, with Supabase, changes sync). Keeps the main catalog under admin control while letting
  vendors self-manage.
- **Where:** `store-template/vendor.html`. Uses `cfg.marketplace.vendors` for the vendor list/codes.
- **Why:** scales the marketplace — vendors do their own data entry; you stay the platform owner.

---

## 2) Delivery / Dispatch & Riders 🛵 (`dispatch.html`)

- **What:** A passcode-protected dispatch board listing all orders. For each order you:
  - **Assign a rider** from your rider list,
  - **📲 Send to rider** — opens WhatsApp to the rider with **pickup + delivery + items + COD total**,
  - **Mark dispatched / delivered** (status pills),
  - **🖨️ Print a packing slip** for the parcel.
- **Where:** `store-template/dispatch.html`. Riders configured in `cfg.dispatch.riders`.
- **Config:**
  ```js
  dispatch: { riders: [ { name: "Musa (Bike)", phone: "2348011111111" } ] }
  ```
  Default dispatch passcode `dispatch123` (set in the generator's section 1️⃣1️⃣, or edit the file).
- **Why:** a complete last-mile workflow — no logistics SaaS needed, all free via WhatsApp + print.

---

## 3) PWA Push / Browser Notifications 🔔 (free, native)

- **What:** A **🔔 Get order alerts** button asks permission (browser Notification API). When granted,
  the customer gets a **native notification** on order placement ("✅ Order received!") that opens the
  tracking page. No third-party service, no cost.
- **Where:** `store-template/assets/js/store-extras5.js` (`Notif`) + button in the header; the existing
  PWA service worker (`sw.js`) already makes the store installable.
- **Config:** `notifications: { enabled: true }`.
- **For server-sent push** (messages when the site is closed), the doc points to free providers
  (e.g. OneSignal free tier) — but the built-in native notifications are 100% free and dependency-free.

---

## 4) Extras

### 4.1 Store QR code 📱
- **What:** A **📱 Store QR Code** button shows a scannable QR linking to the store and a **printable
  poster** ("Scan to shop"). Great for flyers, packaging, and shop windows.
- **Where:** `store-extras5.js` (`showQR`, `printQR`). **Config:** `qr: { enabled: true }`.

### 4.2 Monthly sales-target widget 🎯
- **What:** A progress bar under the hero showing this month's revenue vs your goal.
- **Where:** `store-extras5.js` (`renderTarget`). **Config:** `salesTarget: { enabled: true, monthly: 500000 }`.

---

## 5) New files in v6
```
store-template/vendor.html                   vendor self-service dashboard
store-template/dispatch.html                  dispatch & rider assignment
store-template/assets/js/store-extras5.js     notifications + QR + sales target
docs/CHANGELOG-V6.md                          this file
```
(plus enhanced `index.html`, `config.js`, generator files; demo store now has 3 riders, a sales
target, notifications, and QR enabled.)

---

## 6) Nothing removed
Every v1–v5 capability remains intact (catalog, search, cart, WhatsApp ordering, both payment methods,
Supabase/JSON, Google Drive images, wishlist, reviews, variants, coupons, delivery zones, order
tracking, PWA, bulk CSV, dashboard, store hours, FAQ, testimonials, multi-currency, returns, printable
receipts, Google Sheets logging, loyalty, flash sale, social proof, comparison, trust badges,
multi-vendor marketplace, order splitting, gift cards, referrals, WhatsApp auto-reply, one-click GitHub
deploy, fully-populated demo, ZIP & CLI generation, HMG lead-gen footer). v6 is strictly additive.

💬 Questions? WhatsApp HMG Technologies: https://wa.me/2348100866322

# 🆕 HMG StoreForge v7 — What's New (Detailed)

v7 builds on v1–v6. **Every earlier feature is preserved** — v7 only *adds*. All additions use
**free tools only — no paid AI APIs.**

The headline additions you asked for:
1. **Buyer accounts + saved addresses** — faster checkout, order history.
2. **Subscriptions / recurring orders** — repeat reminders for regular buyers.
3. **Vendor payout / commission ledger** — track what each vendor is owed.
4. **The generator platform itself is now installable as an app (PWA)** — on phone, laptop, desktop.

---

## 1) Buyer Accounts + Saved Addresses 👤 (free, local)

- **What:** Customers tap **👤 Sign in** to save their name, phone, email, and **multiple delivery
  addresses** — no password, stored on their device. Checkout auto-fills, and they can pick a saved
  address from a dropdown. An account drawer shows their **order history** and **subscriptions**.
- **Where:** `store-template/assets/js/store-extras6.js` (`Account`) + account button + checkout prefill
  hook in `store.js`.
- **Config:** `accounts: { enabled: true }`.
- **Why:** repeat customers check out in seconds; you capture cleaner customer data.

---

## 2) Subscriptions / Recurring Orders 🔁 (free)

- **What:** On any in-stock product, customers can **Subscribe** (weekly / every 2 weeks / monthly).
  When the interval is due, they get a **reminder** (browser notification + an on-site reorder bar),
  and can **reorder in one tap** from their account. Great for consumables (food, beauty, groceries).
- **Where:** `store-extras6.js` (`Subscriptions`) + subscribe UI injected into the product modal.
- **Config:** `subscriptions: { enabled: true }`.
- **Why:** turns one-off buyers into recurring revenue — entirely free, no payment-gateway tokens
  needed (the customer confirms each reorder).

---

## 3) Vendor Payout / Commission Ledger 💰 (`ledger.html`)

- **What:** An admin page that reads orders + the product→vendor map and computes, per vendor:
  **orders, units, sales, your commission, and payout owed**. Mark vendors **Paid/Unpaid** and
  **export a CSV**. Totals show overall sales, your commission, and total owed.
- **Where:** `store-template/ledger.html`. Commission rate from `cfg.ledger.commissionPercent`.
- **Why:** essential for running a marketplace — know exactly what to pay each vendor, with records.

---

## 4) Generator installable as an app (PWA) ⬇️

- **What:** The **generator platform itself** can now be **installed** on phone, laptop, and desktop
  (Add to Home Screen / Install app). It works **offline** for ZIP generation (templates are embedded).
- **Where:** `generator/manifest.webmanifest` + `generator/sw.js` + an **⬇️ Install app** button and
  service-worker registration in `generator/index.html`.
- **Generated stores** were already installable (each has its own manifest + `sw.js`). Now the whole
  toolchain is installable. See **[`INSTALL-AS-APP.md`](INSTALL-AS-APP.md)**.
- **Why:** open StoreForge like a native app, generate stores anywhere, even with poor/no internet.

---

## 5) New files in v7
```
store-template/ledger.html                   vendor payout/commission ledger
store-template/assets/js/store-extras6.js     buyer accounts + subscriptions
generator/manifest.webmanifest                generator PWA manifest
generator/sw.js                                generator service worker (offline/installable)
docs/CHANGELOG-V7.md                           this file
docs/INSTALL-AS-APP.md                         how to install on phone/laptop/desktop
```
(plus enhanced `index.html`, `store.js`, `config.js`, generator files; demo store now has accounts,
subscriptions, and an 8% commission ledger enabled.)

---

## 6) Nothing removed
Every v1–v6 capability remains intact (catalog, cart, WhatsApp ordering, both payment methods,
Supabase/JSON, Google Drive images, wishlist, reviews, variants, coupons, delivery zones, order
tracking, PWA, bulk CSV, dashboard, store hours, FAQ, testimonials, multi-currency, returns, receipts,
Google Sheets logging, loyalty, flash sale, social proof, comparison, trust badges, multi-vendor
marketplace, order splitting, gift cards, referrals, WhatsApp auto-reply, vendor self-service
dashboard, dispatch/riders, push notifications, QR code, sales targets, one-click GitHub deploy,
fully-populated demo, ZIP & CLI generation, HMG lead-gen footer). v7 is strictly additive.

💬 Questions? WhatsApp HMG Technologies: https://wa.me/2348100866322

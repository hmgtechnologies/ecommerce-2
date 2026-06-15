# 🛒 HMG StoreForge **v9** — E-Commerce Store Generator Platform

**A product of [HMG Technologies](https://hmgtechnologies.pages.dev) · subsidiary of [HMG Concepts](https://hmgconcepts.pages.dev)**
Created by **Adewale Samson Adeagbo** — AI-Augmented Solutions Developer · Lagos, Nigeria
*His Marvellous Grace — Real problems. Real solutions.*

> **🆕 What's new in v9:**
> - **🎨 Customization Studio** — select **features, layouts, UI/UX, fonts, colours** per client, with a live preview. See [`docs/CUSTOMIZATION-STUDIO.md`](docs/CUSTOMIZATION-STUDIO.md).
> - **🚀 Stronger lead generation** — **your HMG brand is embedded on every client store** (footer + floating badge + pre-filled WhatsApp) to send their users back to you.
> - **❓ Product Q&A**, **💌 abandoned-cart email recovery**, and a **♿ accessibility/Lighthouse pass**. See [`docs/CHANGELOG-V9.md`](docs/CHANGELOG-V9.md), [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md).
> - Client stores remain **searchable on Google/Bing** (SEO + sitemap) and **installable** as apps (PWA).
>
> **🆕 v8 added:** full multi-language (EN/Pidgin/Hausa/Yoruba/Igbo), offline-first order queue, vendor split-payout, stronger SEO.
> **🆕 v7 added:** buyer accounts + saved addresses, subscriptions, vendor payout ledger, installable generator.
> **🆕 v6 added:** vendor self-service dashboard, dispatch/rider assignment, push notifications, store QR, sales targets.
>
> **🆕 v5 added:** multi-vendor marketplace mode, order splitting, WhatsApp auto-reply, gift cards, referrals.
> **🆕 v4 added:** Google Sheets order export, loyalty, flash sale, social proof, comparison, trust badges.
> **🆕 v3 added:** demo store, one-click GitHub deploy, store hours, FAQ, testimonials, multi-currency.
> **🆕 v2 added:** wishlist, reviews, variants, coupons, delivery zones, order tracking, PWA, bulk CSV, dashboard.
>
> **🆕 v4 added:** Google Sheets order export, loyalty points, flash-sale countdown, social proof,
> product comparison, trust badges, back-in-stock alerts, estimated delivery, EN/Pidgin switcher.
> **🆕 v3 added:** demo store, one-click GitHub deploy, store hours, FAQ, testimonials, multi-currency,
> price filter, coupon-by-URL, returns policy, printable receipts. **🆕 v2 added:** wishlist, reviews,
> galleries, variants, coupons, delivery zones, order tracking, PWA, bulk CSV, sales dashboard.
>
> **🆕 v5 added:** multi-vendor marketplace, order splitting, WhatsApp auto-reply, gift cards, referrals.
> **🆕 v4 added:** Google Sheets export, loyalty, flash sale, social proof, comparison, trust badges.
> **🆕 v3 added:** demo store, one-click GitHub deploy, store hours, FAQ, testimonials, multi-currency.
> **🆕 v2 added:** wishlist, reviews, variants, coupons, delivery zones, order tracking, PWA, bulk CSV.
>
> **All v1–v8 features are preserved.** See [`docs/CHANGELOG-V9.md`](docs/CHANGELOG-V9.md),
> [`docs/CHANGELOG-V8.md`](docs/CHANGELOG-V8.md),
> [`docs/CHANGELOG-V7.md`](docs/CHANGELOG-V7.md), [`docs/CHANGELOG-V6.md`](docs/CHANGELOG-V6.md),
> [`docs/CHANGELOG-V5.md`](docs/CHANGELOG-V5.md), [`docs/CHANGELOG-V4.md`](docs/CHANGELOG-V4.md),
> [`docs/CHANGELOG-V3.md`](docs/CHANGELOG-V3.md), [`docs/CHANGELOG-V2.md`](docs/CHANGELOG-V2.md).

---

## 📖 What is HMG StoreForge?

HMG StoreForge is a **platform that generates complete, ready-to-deploy online stores** for your
clients. You (the operator) enter a client's business details once, and StoreForge produces a full
e-commerce website — product catalog, shopping cart, WhatsApp ordering, payments, search, and an
admin panel — packaged into a ZIP you upload to GitHub / Cloudflare Pages.

Each generated store is similar in spirit to **Jumia, Jiji, and Konga**, but is a single-vendor
store owned by your client. Your client then uploads product photos (via **Google Drive links**),
adds prices and descriptions through an **admin panel**, and those products appear instantly on the
storefront for customers — who can pay and contact the seller via **WhatsApp or email**.

> 💡 **Lead generation built in:** Every store carries a *"⚡ Built with HMG StoreForge — Get your
> own store"* footer linking to your WhatsApp and HMG sites. Every client store becomes a permanent
> advertisement that brings you new business.

---

## 🧩 The Three Parts of the Platform

| Part | Folder | Purpose |
|------|--------|---------|
| **1. The Generator** | `generator/` | Where YOU enter client details and download a finished store. Two ways: a browser form (`index.html`) and a Node.js CLI (`cli/generate.js`). |
| **2. The Store Template** | `store-template/` | The actual e-commerce website each client receives (storefront + admin panel). |
| **3. The Supabase Setup** | `supabase/` | Optional free database for live product/order management. |
| **4. The Demo Store** | `demo-store/` | A fully-populated, deployable example showing every feature. Open `demo-store/index.html`. |
| **5. Integrations** 🆕 | `integrations/` | Free Google Sheets order-logging (Apps Script) + setup guide. |

Full documentation lives in [`docs/`](docs/).

---

## ⚡ Quick Start (5 minutes)

### Option A — Browser, download ZIP (easiest, no install)
1. Open `generator/index.html` in any browser (or deploy it to Cloudflare Pages).
2. Fill in the client's details (name, WhatsApp, colours, payment info…).
3. Click **⚙️ Generate Store Files (ZIP)** → a ZIP downloads.
4. Unzip → upload contents to a GitHub repo → deploy on Cloudflare Pages.
5. Send the client their store link + admin passcode. Done.

### Option A2 — Browser, ONE-CLICK GitHub deploy 🆕 (fastest)
1. Open `generator/index.html`, fill the details.
2. In **🚀 One-Click Deploy to GitHub**, paste a GitHub token (see `docs/GITHUB-DEPLOY.md`).
3. Click **🚀 Generate & Deploy to GitHub** → it creates the repo, pushes files, enables Pages.
4. Copy the live URL from the log. Done in ~30 seconds.

### 👁️ Want to see it first? Open `demo-store/index.html` for a fully-populated live demo.

### Option B — Command line (for power users / batch generation)
```bash
cd e-commerce/generator/cli
node generate.js --init                 # creates client.sample.json
# edit client.sample.json with the client's details
node generate.js client.sample.json     # outputs dist/<storeId>/
```

---

## ✨ Feature Highlights (full list in `docs/FEATURES.md`)

**Storefront:** product grid, search, category filter, price/name/date sorting, product detail modal,
shopping cart (saved in browser), dark mode, mobile-responsive, SEO tags, sitemap, social sharing,
floating WhatsApp button, sale & "out of stock" badges, featured products.

**Ordering & Payments:** WhatsApp checkout, bank-transfer details, Paystack/Flutterwave payment
links, auto-generated order summary, optional order storage in Supabase.

**Client Admin Panel:** passcode-protected, add/edit/delete products, Google Drive image links
(auto-converted to direct images), live image preview, JSON export to GitHub, or instant Supabase sync.

**Generator:** live preview, brand-colour picker, both payment methods, Supabase or JSON backend,
custom admin passcode, auto-README per client, SEO files, all packaged into one ZIP.

**🆕 v2 storefront:** wishlist/favourites, product reviews & ratings, multi-image gallery, product
variants (size/colour), recently-viewed, related products, coupon/discount codes, delivery-zone fee
calculator, customer **order-tracking page** (`track.html`), **PWA** (installable + offline via
`sw.js`), newsletter signup, abandoned-cart WhatsApp reminder, share buttons, low-stock badges,
JSON-LD structured data for Google rich results.

**🆕 v2 admin (tabbed):** **Dashboard** (revenue, top products, inventory, charts), **Orders**
(view + change status + export CSV), **Bulk CSV** import/export, **full backup/restore**, product
variants/qty/SKU/gallery fields.

**Enterprise additions:** see `docs/FEATURES.md` → multi-store workflow, order management, analytics
options, backup strategy, white-label notes.

---

## 💰 100% Free-Tool Stack (no paid AI APIs)

| Need | Free Tool |
|------|-----------|
| Hosting | Cloudflare Pages / GitHub Pages |
| Code repo | GitHub |
| Database (optional) | Supabase free tier |
| Image hosting | Google Drive (client's own) |
| Payments | Bank transfer + Paystack/Flutterwave (pay-as-you-go) |
| Customer contact | WhatsApp + email (free) |

No monthly fees. No AI API costs. Built for Nigerian realities — low bandwidth, low budget.

---

## 📚 Documentation Index

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — **step-by-step deployment** (GitHub, Cloudflare, GitHub Pages)
- [`docs/FEATURES.md`](docs/FEATURES.md) — **every feature explained in detail**
- [`docs/CLIENT-GUIDE.md`](docs/CLIENT-GUIDE.md) — hand this to your client (adding products, Google Drive, orders)
- [`docs/SUPABASE-SETUP.md`](docs/SUPABASE-SETUP.md) — optional live database setup
- [`docs/PAYMENTS.md`](docs/PAYMENTS.md) — configuring bank transfer + Paystack/Flutterwave
- [`docs/LEAD-GENERATION.md`](docs/LEAD-GENERATION.md) — how your HMG brand drives leads
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — common issues & fixes
- [`docs/CHANGELOG-V9.md`](docs/CHANGELOG-V9.md) — **🆕 everything new in v9** (Customization Studio, lead-gen, Q&A, recovery, a11y)
- [`docs/CUSTOMIZATION-STUDIO.md`](docs/CUSTOMIZATION-STUDIO.md) — **🆕 design a client store** (fonts/layout/UI/colours/features)
- [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) — **🆕 WCAG/Lighthouse** checklist
- [`docs/CHANGELOG-V8.md`](docs/CHANGELOG-V8.md) — everything new in v8 (languages, offline, payouts, SEO)
- [`docs/SEO-GUIDE.md`](docs/SEO-GUIDE.md) — get found on Google/Bing (free, step-by-step)
- [`docs/CHANGELOG-V7.md`](docs/CHANGELOG-V7.md) — everything new in v7 (accounts, subscriptions, ledger, installable)
- [`docs/INSTALL-AS-APP.md`](docs/INSTALL-AS-APP.md) — install on phone/laptop/desktop (PWA)
- [`docs/CHANGELOG-V6.md`](docs/CHANGELOG-V6.md) — everything new in v6 (vendor dashboard, dispatch, push)
- [`docs/CHANGELOG-V5.md`](docs/CHANGELOG-V5.md) — everything new in v5 (marketplace, WhatsApp auto-reply, more)
- [`integrations/WHATSAPP-AUTOREPLY-SETUP.md`](integrations/WHATSAPP-AUTOREPLY-SETUP.md) — **🆕 free WhatsApp auto-reply** setup
- [`docs/CHANGELOG-V4.md`](docs/CHANGELOG-V4.md) — everything new in v4 (Google Sheets, loyalty, more)
- [`integrations/GOOGLE-SHEETS-SETUP.md`](integrations/GOOGLE-SHEETS-SETUP.md) — free order-to-spreadsheet setup
- [`docs/CHANGELOG-V3.md`](docs/CHANGELOG-V3.md) — everything new in v3 (demo, GitHub deploy, more)
- [`docs/GITHUB-DEPLOY.md`](docs/GITHUB-DEPLOY.md) — one-click GitHub deployment step-by-step
- [`docs/CHANGELOG-V2.md`](docs/CHANGELOG-V2.md) — everything new in v2 (with config examples)

---

## 💬 Support / Custom Work
WhatsApp HMG Technologies: **+234 810 086 6322** · https://wa.me/2348100866322
Email: hmgconcepts@gmail.com · GitHub: https://github.com/hmgtechnologies

⚡ **HMG StoreForge** — Launch real online stores for real Nigerian businesses.

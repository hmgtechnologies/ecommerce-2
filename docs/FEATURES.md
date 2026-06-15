# ✨ Features Explained — HMG StoreForge

A detailed explanation of **every feature** in the system: what it does, why it exists, and where it
lives in the code. Features are grouped by the three parts of the platform, then by enterprise add-ons.

---

## PART A — THE GENERATOR (`generator/`)

### A1. Browser-based generator form (`generator/index.html`)
**What:** A single-page form where you enter a client's details — store identity, contact, social
links, brand colours, payments, and data backend.
**Why:** Lets you create a complete store without writing any code. No installation.
**How:** On clicking *Generate*, `generator.js` reads the form, builds `config.js`, customises
`admin.html`, packages all template files + images into a ZIP, and downloads it.

### A2. Live preview
**What:** A mini-storefront on the right that updates in real time as you type (name, tagline,
colours).
**Why:** You see the client's branding before generating — fewer regenerations.

### A3. Brand-colour picker
**What:** Three colour inputs (primary, accent, secondary) written into the store's CSS variables.
**Why:** Each store looks unique and on-brand for the client.

### A4. Dual payment configuration
**What:** Toggle **bank transfer** (bank, account number, account name) and/or **online gateway**
(Paystack/Flutterwave payment link). See `PAYMENTS.md`.
**Why:** Nigerian buyers expect both. Both are free to set up.

### A5. Backend choice (Supabase OR JSON)
**What:** Leave Supabase fields blank → store uses the free JSON catalog. Fill them → store loads
live from Supabase.
**Why:** Flexibility: zero-signup JSON for simple clients, real database for serious ones.

### A6. Custom admin passcode
**What:** You set the client's admin panel passcode at generation time.
**Why:** Each store ships secured with its own code.

### A7. Auto-generated README per client
**What:** Every ZIP includes a tailored `README.md` with the client's deploy steps and admin passcode.
**Why:** Self-documenting handover.

### A8. SEO & hosting helper files
**What:** `robots.txt`, `sitemap.xml`, `_redirects`, `.gitignore` are auto-included.
**Why:** Makes each store search-engine ready and SPA-friendly on Cloudflare.

### A9. Node.js CLI generator (`generator/cli/generate.js`)
**What:** Generate stores from a JSON config without a browser; supports batch generation.
**Why:** Power users / agencies generating many stores. Run `node generate.js --init` for a sample.

---

## PART B — THE STORE TEMPLATE / STOREFRONT (`store-template/`)

### B1. Responsive storefront (`index.html` + `style.css`)
**What:** Mobile-first layout: sticky header, hero, search/filter bar, category pills, product grid,
about, contact, footer.
**Why:** Most Nigerian shoppers are on phones; the store must look great on small screens.

### B2. Product grid with cards
**What:** Auto-filling responsive grid. Each card shows image, category, name, price, old price
(strikethrough), SALE / Featured / Out-of-stock badges, and an action button.
**Why:** Familiar Jumia/Konga-style browsing.

### B3. Live search
**What:** Instant filtering by product name or description as you type.
**Why:** Quick product discovery.

### B4. Category filter + pills
**What:** Dropdown and clickable category pills filter products by category.
**Why:** Organised browsing for larger catalogs.

### B5. Sorting
**What:** Sort by Featured, Price (low→high / high→low), Name A→Z, or Newest.
**Why:** Shopper control; standard e-commerce expectation.

### B6. Product detail modal
**What:** Click a product → popup with large image, full description, price, and Add-to-cart /
WhatsApp-order buttons.
**Why:** Detailed view without leaving the page.

### B7. Shopping cart (drawer + localStorage)
**What:** Slide-in cart with quantity +/−, remove, running total. Saved in the browser so it
survives refreshes.
**Why:** Multi-item orders; no backend needed.

### B8. Checkout with order summary
**What:** Collects name, phone, address, notes; lets the customer pick a payment method; builds a
formatted order message.
**Why:** Captures everything the seller needs to fulfil the order.

### B9. WhatsApp ordering
**What:** Every order/enquiry opens WhatsApp pre-filled with the full order details to the client's
number.
**Why:** WhatsApp is the #1 commerce channel in Nigeria; instant, free, trusted.

### B10. Email & phone contact
**What:** Contact cards and footer with `mailto:` and `tel:` links.
**Why:** Alternative channels for customers who prefer them.

### B11. Google Drive image support
**What:** Product images can be plain URLs **or Google Drive share links**, auto-converted to direct
image URLs (`store.js` → `driveImage()`).
**Why:** Clients store photos for free on their own Google Drive; no paid image hosting.

### B12. Dark mode
**What:** 🌙 toggle; preference saved per visitor.
**Why:** Modern UX; easier on the eyes; battery saving on OLED phones.

### B13. SEO & social sharing
**What:** Title, meta description, keywords, canonical, Open Graph + Twitter card tags, sitemap.
**Why:** Discoverable on Google; attractive link previews on WhatsApp/Facebook.

### B14. Announcement bar
**What:** Dismissible top banner (e.g. "Free delivery above ₦50,000").
**Why:** Promote offers and build urgency.

### B15. Floating WhatsApp button
**What:** Persistent 💬 button bottom-right.
**Why:** One-tap contact from anywhere on the page.

### B16. Sale / Featured / Out-of-stock states
**What:** Badges and behaviour change per product flag (old price → SALE; `featured` → ★;
`stock:false` → "Out of stock" + enquiry button instead of add-to-cart).
**Why:** Merchandising and accurate availability.

### B17. Graceful data fallback
**What:** Loads products from **Supabase → products.json → built-in fallback**, whichever is
available (`store.js` → `loadProducts()`).
**Why:** The store never shows an empty page, even mid-setup.

---

## PART C — THE CLIENT ADMIN PANEL (`store-template/admin.html`)

### C1. Passcode gate
**What:** Simple passcode (set during generation) gates the dashboard; session-based.
**Why:** Keeps product management private without a paid login system.

### C2. Add / edit / delete products
**What:** Full form: name, category (with autocomplete), price, old price, image, description, stock,
featured.
**Why:** Clients manage their own catalog — no developer needed.

### C3. Google Drive link + live preview
**What:** Paste a Drive link → instant image preview using the same conversion as the storefront.
**Why:** Clients confirm the image works before saving.

### C4. JSON export (free publishing)
**What:** **Download products.json** / **Copy JSON** buttons produce the file to upload to GitHub.
**Why:** Zero-cost publishing path; no database required.

### C5. Supabase sync (live publishing)
**What:** If Supabase is configured, **Sync to Supabase** pushes products live instantly.
**Why:** No re-upload; real-time updates for active stores.

### C6. Local autosave
**What:** Edits persist in the browser (localStorage) so work isn't lost.
**Why:** Safety net before publishing.

### C7. `noindex` protection
**What:** Admin page is excluded from search engines (`robots` meta + `robots.txt`).
**Why:** Keeps the admin URL out of Google.

---

## PART D — OPTIONAL DATABASE (`supabase/`)

### D1. Products table + RLS
**What:** SQL schema with Row-Level Security: public can READ active products; writes are protected.
**Why:** Secure live catalog on a free database.

### D2. Orders table
**What:** Optional table to store submitted orders (customer, items, total, status).
**Why:** Keep a record beyond WhatsApp; foundation for order management.

---

## PART E — ENTERPRISE / ADVANCED FEATURES

> These elevate StoreForge from a simple generator to an enterprise-style platform, **still using
> only free tools**.

### E1. Multi-store workflow
**What:** Each store has a unique `storeId`; carts, themes, and admin data are namespaced by it.
**Why:** Run dozens of client stores without conflicts. Generate, deploy, repeat.

### E2. Order management foundation
**What:** Orders table + status field (`pending/paid/shipped`). Manage from the Supabase Table Editor
(a free, spreadsheet-like admin).
**Why:** Track fulfilment without building a custom dashboard.

### E3. Backup & version control
**What:** Because everything lives in GitHub, every change is versioned and recoverable. `products.json`
acts as a portable backup of the catalog.
**Why:** Enterprise-grade safety with zero cost.

### E4. Analytics (free options)
**What:** Add Cloudflare Web Analytics (free, privacy-friendly, no cookie banner needed) or Google
Analytics by pasting one snippet into `index.html`.
**Why:** Understand traffic and best-sellers. *(Not bundled to keep stores lightweight; see TROUBLESHOOTING.)*

### E5. White-label / reseller mode
**What:** The HMG "Powered by" footer is the lead-gen engine. For premium clients who pay to remove
it, you can delete the `#hmgPowered` line — your business decision.
**Why:** Tiered pricing: free stores advertise you; paid stores can be white-labelled.

### E6. PWA-ready & offline-friendly
**What:** No external runtime dependencies for the storefront; assets are local. Easy to add a
service worker later for installable PWA behaviour.
**Why:** Works on poor connections; can be "installed" to a phone home screen.

### E7. Accessibility & performance
**What:** Semantic HTML, ARIA labels, lazy-loaded images, system fonts (no web-font downloads),
tiny CSS/JS.
**Why:** Fast on low-end devices and slow networks — built for Nigerian realities.

### E8. Security posture
**What:** No secrets in the storefront (only the public Supabase anon key, which is safe). Service
keys are never used client-side. Admin is passcode-gated and `noindex`.
**Why:** Safe by default.

---

## Where things live (quick map)

```
generator/
  index.html              A1  generator form
  assets/js/generator.js  A1  build + ZIP engine
  assets/js/templates.js      embedded store files (auto-generated)
  assets/js/brand.js          HMG branding/lead-gen config
  cli/generate.js         A9  Node CLI generator
store-template/
  index.html              B   storefront markup
  admin.html              C   client admin panel
  products.json           B17 JSON catalog
  assets/css/style.css    B   storefront styles
  assets/js/store.js      B   storefront engine
  assets/js/config.js         per-store config (generated)
supabase/
  schema.sql              D   database + RLS
```

---

# 🆕 v2 FEATURES (additive — see CHANGELOG-V2.md for full details + config)

> Every feature below is **new in v2** and uses **free tools only**. All v1 features above remain.

## Storefront (v2)
- **Wishlist/favourites** — heart on products, wishlist drawer. *(store-extras.js)*
- **Reviews & ratings** — star ratings + written reviews per product. *(store-extras.js)*
- **Multi-image gallery** — thumbnails in the product modal. *(`images: []`)*
- **Product variants** — size/colour selectors. *(`variants: []`)*
- **Stock quantity + low-stock badges** — "Only N left!". *(`qty`)*
- **Recently viewed** & **related products**. *(store-extras.js)*
- **Coupon/discount codes** — percent or fixed, live totals. *(cfg.coupons)*
- **Delivery-zone fees** — per-area fee + free-above threshold. *(cfg.delivery)*
- **Order-tracking page** — `track.html`, status timeline.
- **PWA** — installable + offline. *(manifest.webmanifest + sw.js)*
- **Newsletter capture** — free Formspree + local fallback. *(cfg.newsletter)*
- **Abandoned-cart WhatsApp nudge** — after 30 min idle.
- **Share buttons + deep links** — share/open a product by URL hash.
- **JSON-LD structured data** — Google rich results.
- **Back-to-top** button.
- **Optional free analytics** — Cloudflare / Google. *(cfg.analytics, analytics.js)*

## Admin panel (v2, tabbed)
- **Dashboard** — revenue, top products, inventory, CSS charts.
- **Orders** — view, change status, WhatsApp customer, export CSV.
- **Bulk CSV** — import/export many products at once.
- **Backup/Restore** — full JSON of products+reviews+orders+wishlist.
- **Extended product fields** — qty, SKU, gallery, variants.

## Generator (v2)
- New form sections: **Delivery & Discounts**, **Marketing & Analytics**.
- Packages **all** template files automatically (future-proof).

## New files (v2)
```
store-template/track.html              order tracking
store-template/manifest.webmanifest    PWA manifest
store-template/sw.js                    service worker
store-template/assets/css/extras.css    v2 styles
store-template/assets/js/store-extras.js v2 storefront logic
store-template/assets/js/analytics.js    optional analytics
docs/CHANGELOG-V2.md                     v2 details
```

---

# 🆕 v3 FEATURES (additive — see CHANGELOG-V3.md + GITHUB-DEPLOY.md)

> All new in v3, all free. v1 + v2 features remain.

## Platform additions
- **Demo store** (`demo-store/`) — fully-populated, deployable example (12 products with photos,
  live coupons, zones, hours, FAQ, testimonials, multi-currency).
- **One-click GitHub deploy** — generator creates the repo, pushes all files, and enables GitHub
  Pages via the free GitHub REST API + your token. *(generator/assets/js/github-deploy.js)*

## Storefront (v3)
- **Store open/closed indicator** from business hours. *(cfg.hours)*
- **FAQ accordion**. *(cfg.faq)*
- **Testimonials** with star ratings. *(cfg.testimonials)*
- **Multi-currency display switcher** (NGN/USD/GBP, informational). *(cfg.currencies)*
- **Price-range filter** (min/max).
- **Coupon auto-apply via URL** (`?coupon=CODE`) for campaigns.
- **Returns/refund policy** modal + WhatsApp CTA. *(cfg.returnsPolicy)*
- **Printable receipts** after checkout (and reprint).
- **Customer memory** — remembers name/phone for faster repeat checkout.
- **WhatsApp catalog export** — share the whole product list.

## New files (v3)
```
demo-store/                                fully-populated demo store
store-template/assets/js/store-extras2.js  v3 storefront logic
generator/assets/js/github-deploy.js       GitHub REST API deploy
docs/CHANGELOG-V3.md                        v3 details
docs/GITHUB-DEPLOY.md                       token + deploy guide
```

---

# 🆕 v4 FEATURES (additive — see CHANGELOG-V4.md + integrations/GOOGLE-SHEETS-SETUP.md)

> All new in v4, all free. v1 + v2 + v3 features remain.

## Order operations
- **Google Sheets order logging** — every order → a Google Sheet row + optional email, via a free
  Apps Script Web App (no API key). *(integrations/google-sheets-orders.gs, store-extras3.js)*

## Storefront (v4)
- **Loyalty points** — earn per order, shown in header. *(cfg.loyalty)*
- **Flash-sale countdown** bar. *(cfg.flashSale)*
- **Recently-sold social proof** toasts. *(cfg.socialProof)*
- **Product comparison** (up to 4). *(⚖️ on cards + floating button)*
- **Trust badges** strip. *(cfg.trustBadges)*
- **"Notify me when back in stock"** on out-of-stock items.
- **Estimated delivery date** in checkout. *(cfg.delivery.estimatedDays)*
- **Language switcher** English / Nigerian Pidgin. *(cfg.languages)*

## New files (v4)
```
integrations/google-sheets-orders.gs       Apps Script order logger
integrations/GOOGLE-SHEETS-SETUP.md         setup guide
store-template/assets/js/store-extras3.js   v4 storefront logic
demo-store/assets/images/products/blender.jpg, soap.jpg
docs/CHANGELOG-V4.md                         v4 details
```

---

# 🆕 v5 FEATURES (additive — see CHANGELOG-V5.md, WHATSAPP-AUTOREPLY-SETUP.md)

> All new in v5, all free. v1–v4 features remain.

## Multi-vendor marketplace 🏪 (toggle: cfg.marketplace.enabled)
- **Vendor filter pills** + **vendor directory** ("Our Vendors").
- **Vendor badge** on cards + **"Sold by … · Chat vendor"** in the product modal.
- **Order splitting** — each vendor receives only their items on their WhatsApp.
- **Per-vendor** rating, location, logo. **Commission %** (admin/info).
- **Vendor onboarding page** (`vendor-apply.html`).
- *(marketplace.js + hooks in store.js + cfg.marketplace.vendors[])*

## WhatsApp auto-reply 🤖 (free, no AI)
- Rule-based 24/7 menu responder via Meta WhatsApp Cloud API (free tier) + Apps Script webhook.
- *(integrations/whatsapp-autoreply.gs + WHATSAPP-AUTOREPLY-SETUP.md)*

## Rewards & filters (v5)
- **Gift cards / store credit** at checkout. *(cfg.giftCards)*
- **Referral / refer-a-friend** links + share. *(cfg.referral)*
- **"In stock only"** filter checkbox.

## New files (v5)
```
store-template/assets/js/marketplace.js     multi-vendor logic
store-template/assets/js/store-extras4.js    gift cards + referral + filters
store-template/vendor-apply.html             vendor onboarding
integrations/whatsapp-autoreply.gs           WhatsApp auto-reply
integrations/WHATSAPP-AUTOREPLY-SETUP.md     setup
docs/CHANGELOG-V5.md                          v5 details
```

---

# 🆕 v6 FEATURES (additive — see CHANGELOG-V6.md)

> All new in v6, all free. v1–v5 features remain.

## Vendor self-service 🏪 (vendor.html)
- Vendors log in with their **vendor code** and manage **only their own** products.
- See their **orders, revenue, units sold, low-stock**; download their products JSON to publish.

## Delivery / dispatch 🛵 (dispatch.html)
- Passcode-protected board; **assign orders to riders**, **📲 send job to rider on WhatsApp**
  (pickup + delivery + items + COD), mark **dispatched/delivered**, **🖨️ print packing slips**.
- Riders configured in `cfg.dispatch.riders`. Default passcode `dispatch123`.

## PWA push / notifications 🔔
- **🔔 Get order alerts** opt-in; native browser notification on order placement. *(cfg.notifications)*

## Extras (v6)
- **Store QR code** generator + printable poster. *(cfg.qr)*
- **Monthly sales-target** progress widget. *(cfg.salesTarget)*

## New files (v6)
```
store-template/vendor.html                   vendor self-service dashboard
store-template/dispatch.html                  dispatch & rider assignment
store-template/assets/js/store-extras5.js     notifications + QR + sales target
docs/CHANGELOG-V6.md                          v6 details
```

---

# 🆕 v7 FEATURES (additive — see CHANGELOG-V7.md, INSTALL-AS-APP.md)

> All new in v7, all free. v1–v6 features remain.

## Buyer accounts 👤 (cfg.accounts.enabled)
- Save name/phone/email + **multiple addresses**; checkout auto-fill + address picker; account drawer
  with order history & subscriptions. *(store-extras6.js)*

## Subscriptions / recurring orders 🔁 (cfg.subscriptions.enabled)
- Subscribe to a product (weekly/biweekly/monthly); reminder bar + notification when due; one-tap reorder.

## Vendor payout / commission ledger 💰 (ledger.html)
- Per-vendor orders, units, sales, **your commission**, **payout owed**; mark Paid/Unpaid; export CSV.
- Commission from `cfg.ledger.commissionPercent`.

## Installable as an app (PWA) ⬇️
- **The generator** is installable on phone/laptop/desktop (`generator/manifest.webmanifest` + `sw.js`
  + install button). **All generated stores** are installable too. Works offline for ZIP generation.

## New files (v7)
```
store-template/ledger.html                   vendor payout/commission ledger
store-template/assets/js/store-extras6.js     buyer accounts + subscriptions
generator/manifest.webmanifest + sw.js        generator PWA (installable/offline)
docs/CHANGELOG-V7.md · docs/INSTALL-AS-APP.md  details + install guide
```

---

# 🆕 v8 FEATURES (additive — see CHANGELOG-V8.md, SEO-GUIDE.md)

> All new in v8, all free. v1–v7 features remain.

## Full multi-language 🌍 (cfg.languages)
- Real translations: **English, Pidgin, Hausa, Yoruba, Igbo** + dropdown. *(i18n.js, data-i18n attrs)*
- Updates `<html lang>` for accessibility/SEO. Extensible dictionary.

## Offline-first order queue 📴 (store-extras7.js)
- Place orders with **no internet**; queued locally; **auto-sent** (WhatsApp + Sheets) on reconnect.
- Online/offline status bar + "Send now" button.

## Vendor split-payout 💸 (ledger.html)
- **💸 Pay** per vendor → WhatsApp payout message with **bank details** + amount owed.
- Add `bank`, `accountNumber`, `accountName` to each vendor in `cfg.marketplace.vendors`.

## Stronger SEO 🔎 (searchable on Google/Bing)
- Richer head tags, multi-page **sitemap.xml** (CLI + browser), **robots.txt** with sitemap ref,
  JSON-LD, Google verification placeholder. Step-by-step submission in **SEO-GUIDE.md**.

## Installable 📲
- Store + generator are PWAs (installable on phone/laptop/desktop). See INSTALL-AS-APP.md.

## New files (v8)
```
store-template/assets/js/i18n.js              multi-language dictionaries
store-template/assets/js/store-extras7.js      offline queue + payout helpers
docs/SEO-GUIDE.md · docs/CHANGELOG-V8.md       SEO guide + v8 details
```

---

# 🆕 v9 FEATURES (additive — see CHANGELOG-V9.md, CUSTOMIZATION-STUDIO.md, ACCESSIBILITY.md)

> All new in v9, all free. v1–v8 features remain.

## 🎨 Customization Studio (cfg.design)
- **Fonts** (8, incl. free Google Fonts), **layouts** (classic/grid/magazine/minimal),
  **hero** (split/banner/centered/none), **card style** (shadow/border/flat/overlay),
  **UI style** (standard/glass/neumorph/bold), **roundness/button/density**, **dark default**,
  **8 colour presets** + custom colours — all with **live preview** in the generator.
- *(theme-engine.js + themes.css + Studio UI in generator)*

## ✅ Feature Selection (cfg.features)
- Toggle sections per client: wishlist, reviews, Q&A, testimonials, FAQ, newsletter, recently-viewed,
  trust badges, dark-mode, loyalty, accounts, notifications. Disabled sections hidden automatically.

## 🚀 Lead generation (cfg.leadGen) — YOUR brand on every store
- Footer "Built by HMG Technologies · Adewale Samson Adeagbo · Get your own store" + **floating badge**
  + pre-filled WhatsApp naming the client store. Sourced from `generator/assets/js/brand.js`.

## ❓ Product Q&A · 💌 Cart recovery · ♿ Accessibility
- **Q&A** on product modals (sent to your WhatsApp). *(store-extras8.js)*
- **Abandoned-cart email recovery** via free Formspree. *(cfg.recovery)*
- **WCAG/Lighthouse pass**: skip link, focus outlines, ARIA, reduced-motion, fast assets.

## New files (v9)
```
store-template/assets/js/theme-engine.js     design + feature engine
store-template/assets/css/themes.css          layout/UI variants
store-template/assets/js/store-extras8.js     Q&A + cart recovery + reveal
docs/CUSTOMIZATION-STUDIO.md · docs/ACCESSIBILITY.md · docs/CHANGELOG-V9.md
```

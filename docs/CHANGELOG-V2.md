# 🆕 HMG StoreForge v2 — What's New (Detailed)

v2 is a **major enterprise upgrade**. **Every v1 feature is preserved** — v2 only *adds*. This
document explains each new feature: what it does, why it matters, how to configure it, and where it
lives in the code. All additions use **free tools only — no paid AI APIs.**

---

## A. New STOREFRONT features (customer-facing)

### A1. Wishlist / Favourites ❤️
- **What:** Customers tap the heart on any product to save it. A wishlist drawer (header ❤️ button)
  lists saved items with "Add to cart" / "Remove".
- **Why:** Encourages return visits and higher conversion.
- **Where:** `assets/js/store-extras.js` (`Wish`), heart button in `store.js` product cards, drawer in
  `index.html`.
- **Config:** none needed — works automatically. Saved per browser (localStorage).

### A2. Product Reviews & Ratings ⭐
- **What:** Star ratings + written reviews on each product modal. Average rating shown.
- **Why:** Social proof builds trust and sales.
- **Where:** `store-extras.js` (`Reviews`), rendered inside the product modal.
- **Config:** none. Reviews are stored per device (localStorage). For centralised reviews across all
  visitors, add a Supabase `reviews` table (see SUPABASE-SETUP.md → advanced).

### A3. Multi-image Gallery 🖼️
- **What:** Products can have several images; thumbnails appear in the modal and swap the main image.
- **Where:** `store-extras.js` (`decorateModal`), product field `images: []`.
- **Config:** In the admin "Extra images" box, paste comma-separated Google Drive/URLs. In
  `products.json`: `"images": ["link1","link2"]`.

### A4. Product Variants (size / colour) 🎨
- **What:** Selectable options like Size: S/M/L or Colour: Red/Blue on the product modal.
- **Where:** `store-extras.js`, product field `variants: [{name, options[]}]`.
- **Config:** Admin "Variants" box format: `Size: S, M, L | Colour: Red, Blue`.

### A5. Stock-quantity awareness 📦
- **What:** Optional per-product quantity. Shows "Only N left!" low-stock badges and "In stock (N)".
- **Where:** `store.js` normalize + card badge, `store-extras.js` modal.
- **Config:** Admin "Stock quantity" field, or `"qty": 10` in products.json. Leave blank to hide.

### A6. Recently Viewed 👀
- **What:** A strip of the last products the customer opened.
- **Where:** `store-extras.js` (`Recent`), `#recentSection` in `index.html`.

### A7. Related Products 🛍️
- **What:** "You may also like" — same-category items shown in the product modal.
- **Where:** `store-extras.js` `decorateModal`.

### A8. Coupon / Discount Codes 🎟️
- **What:** Customers enter a code at checkout for a percent or fixed discount; totals update live.
- **Where:** `store-extras.js` (`applyCoupon`, `discountAmount`), checkout UI in `store.js`.
- **Config (config.js):**
  ```js
  coupons: [
    { code: "WELCOME10", type: "percent", value: 10, minTotal: 0 },
    { code: "SAVE2000",  type: "fixed",   value: 2000, minTotal: 20000 }
  ]
  ```
  In the generator form: `WELCOME10:percent:10, SAVE2000:fixed:2000`.

### A9. Delivery-zone Fees 🚚
- **What:** Customer selects a delivery area; the fee is added to the total. Free above a threshold.
- **Where:** `store-extras.js` (`deliveryFee`, `getZones`), checkout UI in `store.js`.
- **Config (config.js):**
  ```js
  delivery: {
    freeAbove: 50000,
    zones: [
      { name: "Lagos Mainland", fee: 1500 },
      { name: "Lagos Island",   fee: 2500 },
      { name: "Outside Lagos",  fee: 4000 }
    ]
  }
  ```
  Generator form: `Lagos Mainland:1500, Lagos Island:2500, Outside Lagos:4000`.

### A10. Customer Order-Tracking page 📦
- **What:** `track.html` lets customers enter their Order ID to see status (placed → paid → shipped →
  delivered) and items. Recent orders on the device are listed.
- **Where:** `track.html`, linked in the nav; orders saved by `store-extras.js` `Orders` on checkout.
- **Config:** none. For cross-device tracking, store orders in Supabase (orders table already in
  `schema.sql`).

### A11. PWA — Installable + Offline 📱
- **What:** The store can be "Added to Home Screen" and loads instantly / works offline-ish.
- **Where:** `manifest.webmanifest`, `sw.js` (service worker), registration in `index.html`.
- **Why:** Huge for Nigerian users on poor connections; feels like a real app.
- **Config:** none. Works once deployed over HTTPS (Cloudflare/GitHub Pages provide this free).

### A12. Newsletter Capture 📬
- **What:** Email signup section. Sends to **Formspree (free)** if configured; always stored locally
  as a fallback so leads aren't lost.
- **Where:** `store-extras.js` `bindNewsletter`, section in `index.html`.
- **Config (config.js):** `newsletter: { formspreeId: "xayzabcd" }` (get a free ID at formspree.io).

### A13. Abandoned-cart WhatsApp Nudge 🛒
- **What:** If items sit in the cart > 30 min, a bar invites the customer to complete via WhatsApp
  (pre-filled with their items).
- **Where:** `store-extras.js` `checkAbandonedCart`, `#abandonBar` in `index.html`.

### A14. Share buttons 🔗
- **What:** Share a product via the native share sheet or copy a deep link (`#productId`).
- **Where:** `store-extras.js` `shareProduct`. Deep links auto-open the product on load.

### A15. SEO: JSON-LD structured data
- **What:** Adds `Store` + `Product` schema.org data for Google rich results.
- **Where:** `store-extras.js` `injectStructuredData`.

### A16. Back-to-top button ⬆️
- **Where:** `#backTop` in `index.html`, logic in `store-extras.js`.

### A17. Optional free Analytics 📊
- **What:** Cloudflare Web Analytics (privacy-friendly, no cookie banner) and/or Google Analytics 4.
- **Where:** `assets/js/analytics.js`.
- **Config (config.js):** `analytics: { cloudflareToken: "", googleId: "G-XXXX" }`. Blank = nothing
  loads (zero overhead/cost).

---

## B. New ADMIN PANEL features (`admin.html`, now tabbed)

### B1. Dashboard tab 📊
- Revenue, order count, product/category counts, review count, low-stock count.
- Bar charts (pure CSS, no library): orders by status, top products by units, full inventory table.

### B2. Orders tab 🧾
- View orders placed on the device, **change status** (pending/paid/shipped/delivered), one-tap
  WhatsApp the customer, and **export orders to CSV**.

### B3. Bulk CSV import/export 📥
- Download a CSV template, fill in Excel/Google Sheets, import many products at once (append or
  replace). Export current products to CSV too.
- Columns: `name,price,oldPrice,category,description,image,stock,featured,qty,sku`.

### B4. Full Backup & Restore 🗄️
- One-click download of products + reviews + orders + wishlist as a single JSON; restore on any
  device. Great for safety and migration.

### B5. Extended product fields
- New inputs: **stock quantity**, **SKU**, **gallery images**, **variants** — feeding the new
  storefront features above.

### B6. Product search/filter in the list
- Quickly find products in large catalogs.

---

## C. New GENERATOR options

- Form sections **7️⃣ Delivery & Discounts** and **8️⃣ Marketing & Analytics** capture the new config.
- The browser generator now **packages every template file automatically**, so all v2 files
  (`track.html`, `sw.js`, `extras.css`, `store-extras.js`, `analytics.js`, `manifest.webmanifest`)
  are always included.
- The CLI (`cli/generate.js`) sample config includes v2 examples (`node generate.js --init`).

---

## D. New files added in v2

```
store-template/
  track.html                      order-tracking page
  manifest.webmanifest            PWA manifest
  sw.js                           service worker (offline/PWA)
  assets/css/extras.css           styles for all v2 UI
  assets/js/store-extras.js       all v2 storefront logic
  assets/js/analytics.js          optional free analytics loader
docs/
  CHANGELOG-V2.md                 this file
```
(plus enhanced `admin.html`, `store.js`, `config.js`, `products.json`, generator files)

---

## E. Nothing removed
Every v1 capability — product grid, search, sort, cart, WhatsApp ordering, both payment methods,
Supabase/JSON fallback, Google Drive images, dark mode, SEO, generator, CLI, HMG lead-gen footer —
is **fully intact**. v2 is strictly additive.

💬 Questions? WhatsApp HMG Technologies: https://wa.me/2348100866322

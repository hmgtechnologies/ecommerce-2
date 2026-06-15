# 🚀 Deployment Guide — HMG StoreForge

This guide gives **clear, unambiguous, step-by-step** instructions. There are two things you may
deploy:

- **(A) The Generator platform** — so you can access it online from anywhere.
- **(B) A generated client store** — the actual shop for each client.

Everything below uses **free tools only**.

---

## PART 1 — Prerequisites (one-time, ~10 minutes)

1. **Create a GitHub account** → https://github.com/signup (free).
2. **Create a Cloudflare account** → https://dash.cloudflare.com/sign-up (free). *(Recommended host. GitHub Pages also works — see Part 4.)*
3. **Install Git** (only needed if you prefer command line) → https://git-scm.com/downloads.
   *You can do everything through the GitHub website without installing anything.*
4. *(Optional, for live database)* **Create a Supabase account** → https://supabase.com (free). See `SUPABASE-SETUP.md`.

---

## PART 2 — Deploy the GENERATOR platform online (optional but recommended)

Hosting the generator means you can open it from any device and generate stores anywhere.

### Step 2.1 — Put the generator on GitHub
1. Go to https://github.com/new
2. Repository name: `storeforge-generator` → set to **Public** → click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Drag in the **entire contents of the `generator/` folder** (so `index.html` is at the repo root).
   - Important: upload the *contents* of `generator/`, not the folder itself, so `index.html` is at the top level.
5. Click **Commit changes**.

### Step 2.2 — Deploy with Cloudflare Pages
1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub, then select your `storeforge-generator` repo.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` *(root)*
4. Click **Save and Deploy**. Wait ~1 minute.
5. Your generator is live at `https://storeforge-generator.pages.dev`. Bookmark it.

> ✅ You can now generate client stores from anywhere by visiting that URL.

---

## PART 3 — Deploy a GENERATED CLIENT STORE (do this for every client)

### Step 3.1 — Generate the store files
**Browser way:** open the generator (local file or your live URL) → fill the form → click
**Generate Store Files** → a ZIP named `<storeId>-storeforge.zip` downloads → **unzip it**.

**CLI way:**
```bash
cd e-commerce/generator/cli
node generate.js client.json      # produces dist/<storeId>/
```

### Step 3.2 — Create the client's GitHub repository
1. Go to https://github.com/new
2. Repository name: use the client's **store ID** (e.g. `bellas-fashion`) → **Public** → **Create repository**.

### Step 3.3 — Upload the store files
1. On the repo page, click **uploading an existing file**.
2. Drag in **all the files from the unzipped store folder** — keep the folder structure
   (`index.html` must be at the repo root, with the `assets/` folder beside it).
3. Click **Commit changes**.

### Step 3.4 — Deploy with Cloudflare Pages
1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the client's repo (e.g. `bellas-fashion`).
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(empty)*
   - **Build output directory:** `/`
4. **Save and Deploy** → wait ~1 minute.
5. The store is live at `https://bellas-fashion.pages.dev`.

### Step 3.5 — Hand over to the client
Send your client:
- **Store link:** `https://<storeId>.pages.dev`
- **Admin link:** `https://<storeId>.pages.dev/admin.html`
- **Admin passcode:** the one you set in the generator (default `admin1234`)
- The `CLIENT-GUIDE.md` document (rename/share it as a PDF or message).

---

## PART 4 — Alternative host: GitHub Pages (also free)

If you prefer not to use Cloudflare:
1. In the client's repo, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**: choose **Deploy from a branch**.
3. **Branch:** `main` · **Folder:** `/ (root)` → **Save**.
4. Wait 1–2 minutes. The store is live at `https://<your-github-username>.github.io/<repo-name>/`.

> ⚠️ On GitHub Pages the URL contains the repo name as a sub-path. If links break, ensure all paths
> in the store are relative (they are by default in StoreForge). Cloudflare Pages avoids this issue,
> which is why it is recommended.

---

## PART 5 — Custom domain (optional, client may pay for the domain only)

1. Client buys a domain (e.g. from Namecheap / GoDaddy / Whogohost).
2. In Cloudflare Pages → your project → **Custom domains** → **Set up a domain** → enter the domain.
3. Follow Cloudflare's DNS instructions (add a CNAME). Propagation: a few minutes to a few hours.
4. SSL/HTTPS is automatic and free.

---

## PART 6 — Updating a live store

**Products (most common):** the client uses the admin panel → **Download products.json** → uploads
it to the repo (replacing the old file). Cloudflare redeploys automatically in ~1 minute.
*(If using Supabase, no upload is needed — changes are instant.)*

**Design / text changes:** edit the file in GitHub (or re-upload) → Cloudflare auto-redeploys.

---

## PART 7 — v2 notes (PWA, discounts, delivery, analytics)

**PWA / offline:** Works automatically once the store is served over **HTTPS** — both Cloudflare
Pages and GitHub Pages provide free HTTPS, so nothing extra is needed. Customers can "Add to Home
Screen". (PWA features are silently skipped if opened directly from a local file.)

**Coupons & delivery zones:** Set these in `assets/js/config.js` (or via the generator's section 7).
Example:
```js
coupons: [{ code: "WELCOME10", type: "percent", value: 10, minTotal: 0 }],
delivery: { freeAbove: 50000, zones: [{ name: "Lagos Mainland", fee: 1500 }] }
```
After editing, re-upload `config.js` to the repo.

**Newsletter (free):** create a form at https://formspree.io, copy its ID, and set
`newsletter: { formspreeId: "xxxx" }` in `config.js`.

**Analytics (free):** add a Cloudflare Web Analytics token or a Google Analytics ID in
`analytics: {...}`. Leave blank to keep the store ultra-light.

**Bulk products:** in `admin.html` → **Bulk CSV** tab, download the template, fill it in
Excel/Sheets, and import — then publish as usual.

**Order tracking:** customers visit `https://<storeId>.pages.dev/track.html` and enter their Order
ID. (Orders are saved on the device used to order; enable the Supabase `orders` table for
cross-device tracking.)

---

## PART 8 — v3: One-click GitHub deploy & the demo store

**Fastest path (v3):** instead of downloading a ZIP and uploading, use the generator's
**🚀 One-Click Deploy to GitHub** panel. Paste a GitHub token and StoreForge creates the repo,
pushes every file, and enables GitHub Pages automatically. Full token steps and troubleshooting are
in **[`GITHUB-DEPLOY.md`](GITHUB-DEPLOY.md)**.

**Preview the demo store:** open `demo-store/index.html` locally, or deploy the `demo-store/` folder
exactly like any client store (GitHub repo → Cloudflare/GitHub Pages) to show prospects a live,
fully-stocked example.

**New v3 config options** (in `assets/js/config.js`, or leave defaults):
```js
hours: { enabled: true, timezone: "Africa/Lagos", schedule: { mon:["08:00","20:00"], /* ... */ } },
faq: [{ q: "...", a: "..." }],
testimonials: [{ name: "...", text: "...", rating: 5 }],
currencies: { base:"NGN", rates:{NGN:1,USD:0.00067,GBP:0.00053}, symbols:{NGN:"₦",USD:"$",GBP:"£"} },
returnsPolicy: "Your returns policy text..."
```
After editing, re-upload `config.js` (or just redeploy).

---

## PART 9 — v4: Google Sheets order logging & engagement features

**Google Sheets order book (free, recommended):** follow
**[`../integrations/GOOGLE-SHEETS-SETUP.md`](../integrations/GOOGLE-SHEETS-SETUP.md)** to create a
sheet, paste the Apps Script, deploy it as a Web App, and copy the `/exec` URL. Put that URL in
`assets/js/config.js → orders.sheetsWebAppUrl` (or the generator's **section 9️⃣**). Every order then
appears as a spreadsheet row automatically — in addition to WhatsApp.

**Engagement options** (in `config.js`, all optional):
```js
loyalty:   { enabled: true, pointsPerNaira: 0.001 },
flashSale: { enabled: true, title: "Flash Sale!", endsAt: "2026-07-01T23:59:59" },
socialProof: { enabled: true },
languages: { enabled: true },
delivery:  { freeAbove: 50000, estimatedDays: 3, zones: [ /* ... */ ] },
trustBadges: [ { icon: "🚚", title: "Fast Delivery", text: "1–5 days" } ]
```
After editing, re-upload `config.js` (or redeploy). Leave any feature disabled to keep the store light.

---

## PART 10 — v5: Marketplace mode & WhatsApp auto-reply

**Enable marketplace (Jumia/Jiji-style):** in `assets/js/config.js` set `marketplace.enabled: true`
and list your vendors, then give each product a `vendor` id. Example:
```js
marketplace: {
  enabled: true, commissionPercent: 8,
  vendors: [
    { id: "v1", name: "Bella Fashion", whatsapp: "2348011111111", location: "Lagos", rating: 4.8 },
    { id: "v2", name: "Tech Hub",      whatsapp: "2348022222222", location: "Abuja", rating: 4.6 }
  ]
}
// in products.json: add  "vendor": "v1"  to each product
```
When a cart spans multiple vendors, each vendor is messaged with only their items (order splitting).
Vendors apply via `vendor-apply.html`. In the generator, use **section 🔟** (vendors format
`Name|whatsapp|location; …`).

**Gift cards & referrals (optional):**
```js
giftCards: [{ code: "GIFT5000", value: 5000 }],
referral: { enabled: true, rewardText: "Refer a friend, earn credit!" }
```

**WhatsApp auto-reply (optional, advanced):** follow
**[`../integrations/WHATSAPP-AUTOREPLY-SETUP.md`](../integrations/WHATSAPP-AUTOREPLY-SETUP.md)** to set
up a free 24/7 WhatsApp menu responder (Meta Cloud API + Apps Script). The default WhatsApp ordering
works without it.

---

## PART 11 — v6: Vendor dashboard, dispatch/riders & notifications

**Vendor self-service:** vendors visit `https://<store>.pages.dev/vendor.html` and log in with their
**vendor code** (the `id` you gave them in `cfg.marketplace.vendors`, e.g. `v1`). They manage only
their own products and download a `v1-products.json` to send you for merging.

**Dispatch & riders:** you (or your dispatch staff) open `https://<store>.pages.dev/dispatch.html`,
enter the dispatch passcode, then assign each order to a rider and send the job to the rider's
WhatsApp. Configure riders:
```js
dispatch: { riders: [ { name: "Musa (Bike)", phone: "2348011111111" } ] }
```
Set the dispatch passcode in the generator's **section 1️⃣1️⃣** (default `dispatch123`).

**Push notifications:** set `notifications: { enabled: true }`. Customers tap **🔔 Get order alerts**
to opt in and receive a native browser notification when they place an order. (Works on HTTPS — which
Cloudflare/GitHub Pages provide free. For messages while the site is closed, see the note in
CHANGELOG-V6 about free push providers.)

**Store QR & sales target:** `qr: { enabled: true }` shows a **📱 Store QR Code** button + printable
poster. `salesTarget: { enabled: true, monthly: 500000 }` shows a goal progress bar.

> 🔒 `vendor.html` and `dispatch.html` are excluded from search engines via `robots.txt`.

---

## PART 12 — v7: Accounts, subscriptions, payout ledger & installable app

**Buyer accounts & subscriptions** are on by default (`accounts.enabled`, `subscriptions.enabled` in
`config.js`). Customers tap **👤 Sign in** to save details, and **Subscribe** on products for repeat
reminders. Nothing to deploy beyond the normal store.

**Vendor payout ledger:** open `https://<store>.pages.dev/ledger.html`, enter the admin passcode, and
see each vendor's sales, your commission, and payout owed; export CSV; mark Paid/Unpaid. Set the rate:
```js
ledger: { commissionPercent: 8 }
```

**Install as an app (PWA):** because Cloudflare/GitHub Pages serve over HTTPS, the generator **and**
every store can be installed on phone, laptop, and desktop. Full steps in
**[`INSTALL-AS-APP.md`](INSTALL-AS-APP.md)**. Quick version:
- **Generator:** deploy `generator/` → open it → click **⬇️ Install app** (or browser menu → Install).
- **Stores:** open the store → Chrome menu → **Install app** (Android/desktop) or Safari **Share → Add
  to Home Screen** (iPhone).

> 🔒 `ledger.html` is `noindex` + blocked in `robots.txt` alongside admin/vendor/dispatch.

---

## PART 13 — v8: Languages, offline orders, payouts & SEO

**Multi-language:** on by default (`languages.enabled`). Customers pick English/Pidgin/Hausa/Yoruba/Igbo
from the header dropdown. To add a language, edit `assets/js/i18n.js` (`DICT`) and `languages.list`.

**Offline-first orders:** works automatically once the store is on HTTPS (PWA + service worker). If a
customer is offline, the order is queued and **auto-sent** when they reconnect (a status bar shows it).
Nothing to configure.

**Vendor split-payout:** add bank fields to each vendor and use the **💸 Pay** button in `ledger.html`:
```js
marketplace: { enabled: true, vendors: [
  { id:"v1", name:"Bella Fashion", whatsapp:"234…", bank:"GTBank", accountNumber:"0123456781", accountName:"Bella Fashion Ltd" }
]}
```

**Make it findable on Google/Bing (free):** every store ships with `sitemap.xml`, `robots.txt`,
JSON-LD, and full meta tags. Follow **[`SEO-GUIDE.md`](SEO-GUIDE.md)** to:
1. Verify the site in **Google Search Console** (paste the verification meta into `index.html`).
2. Submit `sitemap.xml` in Search Console **and** Bing Webmaster Tools.
3. Request indexing; add real product names/descriptions.

**Installable app:** the store and the generator are PWAs — installable on phone, laptop, and desktop.
See **[`INSTALL-AS-APP.md`](INSTALL-AS-APP.md)**.

---

## PART 14 — v9: Customization Studio, lead generation, Q&A, recovery, a11y

**Design each client's store:** use the generator's **🎨 Customization Studio** (fonts, layout, hero,
card style, UI style, roundness, density, dark default) + **colour presets**, and the **✅ Feature
Selection** panel to enable only what they need — watch the **live preview**. Full guide:
**[`CUSTOMIZATION-STUDIO.md`](CUSTOMIZATION-STUDIO.md)**. Or edit `assets/js/config.js → design / features`.

**Lead generation (your brand on every store):** set your details ONCE in
`generator/assets/js/brand.js` (company, founder, site, WhatsApp, email). Every generated store then
shows **"Built by HMG Technologies · Get your own store"** in the footer plus a floating badge linking
to your WhatsApp. To hide the badge for a premium client, set `leadGen.badge: false` in their config.

**Product Q&A:** on by default (`features.qa`). Customer questions open your WhatsApp to answer.

**Abandoned-cart email recovery (free):** enable in the generator's section 8️⃣ (or `cfg.recovery`):
```js
recovery: { enabled: true, formspreeId: "YOUR_FORMSPREE_ID", coupon: "COMEBACK10", delayMinutes: 60 }
```

**Accessibility/Lighthouse:** stores ship WCAG-friendly + fast. Run a free Lighthouse report in Chrome
DevTools; see **[`ACCESSIBILITY.md`](ACCESSIBILITY.md)**.

---

## ✅ Deployment Checklist (per client)

- [ ] Store files generated (ZIP or CLI output)
- [ ] GitHub repo created with the store ID
- [ ] All files uploaded (index.html at root, assets/ beside it)
- [ ] Cloudflare Pages connected & deployed
- [ ] Store opens at `https://<storeId>.pages.dev`
- [ ] Admin panel opens and passcode works
- [ ] WhatsApp button opens the correct number
- [ ] At least one real product added & visible
- [ ] (If used) Supabase schema run & keys in config.js
- [ ] Client given links, passcode, and CLIENT-GUIDE

---

💬 Stuck? WhatsApp HMG Technologies: https://wa.me/2348100866322

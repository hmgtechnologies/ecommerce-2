# 🔎 SEO — Make the Store Findable on Google, Bing & Others (Free)

Every HMG StoreForge store is built to be **search-engine friendly out of the box**: proper titles,
meta description, keywords, canonical URL, Open Graph/Twitter cards, **JSON-LD structured data**
(Store + Products for rich results), a **sitemap.xml**, and a **robots.txt**. This guide shows how to
get the store **indexed and ranking** — all with **free tools**.

> The store is also a **PWA** (installable). Search engines index it like any normal website.

---

## What's already built in (no action needed)
- **`<title>`, description, keywords, author** — auto-filled from the client's details.
- **Canonical URL** — prevents duplicate-content issues.
- **Open Graph + Twitter cards** — rich link previews on WhatsApp/Facebook/X.
- **`robots` meta = index, follow** on public pages; admin/vendor/dispatch/ledger are **noindex**.
- **JSON-LD structured data** — `Store` + up to 20 `Product` entries (helps Google show rich results).
- **`sitemap.xml`** — lists public pages; referenced from `robots.txt`.
- **Mobile-friendly + fast** — Google ranks mobile-first; the store is responsive and lightweight.
- **HTTPS** — provided free by Cloudflare/GitHub Pages (a ranking signal).

---

## Step 1 — Deploy on HTTPS (required for indexing)
Deploy the store on **Cloudflare Pages** or **GitHub Pages** (see DEPLOYMENT.md). Both give free HTTPS
and a public URL like `https://your-store.pages.dev`. Search engines can only index public HTTPS URLs.

## Step 2 — Submit to Google Search Console (free)
1. Go to **https://search.google.com/search-console** and sign in.
2. **Add property** → choose **URL prefix** → enter your store URL (e.g. `https://your-store.pages.dev`).
3. **Verify ownership** — easiest method: **HTML tag**.
   - Copy the `<meta name="google-site-verification" content="…">` tag Google gives you.
   - In `index.html`, uncomment the placeholder line near the top and paste your code:
     `<meta name="google-site-verification" content="YOUR_CODE" />`
   - Re-upload `index.html` (or redeploy) and click **Verify**.
4. In Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.
5. Use **URL Inspection** → paste your URL → **Request indexing** (speeds up first crawl).

## Step 3 — Submit to Bing Webmaster Tools (free)
1. Go to **https://www.bing.com/webmasters** and sign in.
2. **Add a site** → enter your URL. You can **import from Google Search Console** in one click.
3. Submit your `sitemap.xml` under **Sitemaps**.
   *(Bing also powers Yahoo & DuckDuckGo, so this covers several engines.)*

## Step 4 — Help search engines understand your products
- Give every product a clear **name, description, category, and image** (in the admin).
- Use real, keyword-rich descriptions ("Ankara fabric 6 yards Lagos delivery") — not just "Item 1".
- Keep prices and stock accurate; the JSON-LD reflects them for rich results.

## Step 5 — Build authority (free, ongoing)
- Add your store link to your **Google Business Profile**, **Instagram/Facebook bio**, **WhatsApp
  status**, and **TikTok**.
- Ask happy customers to share the link (the OG card makes shares look professional).
- Post the **store QR code** (v6) on flyers and packaging.

---

## Optional: custom domain (better branding & SEO)
A custom domain (e.g. `bellasfashion.com`) looks more trustworthy and is easy to rank. The client buys
the domain; connect it free in Cloudflare Pages → **Custom domains** (see DEPLOYMENT.md, Part 5). HTTPS
is automatic. Then re-submit the new domain to Search Console/Bing.

---

## Verify your SEO is working
- Visit `https://your-store.pages.dev/sitemap.xml` and `…/robots.txt` — they should load.
- Use **Google Rich Results Test** (https://search.google.com/test/rich-results) → paste your URL →
  confirm `Product`/`Store` data is detected.
- Use **PageSpeed Insights** (https://pagespeed.web.dev) → check mobile score (should be high).
- After a few days, search `site:your-store.pages.dev` on Google to see indexed pages.

---

## Quick checklist
- [ ] Store deployed on HTTPS (Cloudflare/GitHub Pages)
- [ ] Google Search Console verified + `sitemap.xml` submitted
- [ ] Bing Webmaster verified + sitemap submitted
- [ ] Real product names/descriptions/images added
- [ ] (Optional) custom domain connected
- [ ] Rich Results Test passes; mobile PageSpeed good
- [ ] Link shared on social + Google Business Profile

💬 Need help getting ranked? WhatsApp HMG Technologies: https://wa.me/2348100866322

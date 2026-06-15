# 📈 Lead Generation — How HMG StoreForge Grows Your Business

HMG StoreForge isn't just a tool — it's a **lead-generation engine for your brand (HMG Technologies /
Adewale Samson Adeagbo)**. Every store you build quietly markets you to new clients. Here's how, and
how to maximise it.

---

## 1. The "Powered by" footer (your core lead magnet)

Every generated store includes this in the footer (`store-template/index.html` → `#hmgPowered`,
populated by `store.js`):

> ⚡ Built with **HMG StoreForge** · **Get your own store 💬**

- "HMG StoreForge" links to **https://hmgtechnologies.pages.dev**.
- "Get your own store" opens **your WhatsApp** with a pre-filled message:
  *"Hi! I want my own online store like [Store Name]."*

So every visitor to every client store — potentially thousands of shoppers — sees your brand and can
reach you in one tap. **This is how a single store becomes ongoing advertising.**

---

## 2. Your brand embedded across the generator

The generator (`generator/index.html`) shows:
- HMG StoreForge logo and "by HMG Technologies" header.
- A sidebar linking to **all your sites**: HMG Concepts, Technologies, Academy, Media, Gospel, and
  your portfolio (`cssadewale.pages.dev`).
- A WhatsApp CTA and footer crediting **Adewale Samson Adeagbo · Lagos · His Marvellous Grace**.

All pulled from one place: `generator/assets/js/brand.js`. Update once, it changes everywhere.

---

## 3. Update your contact details (do this first!)

Open `generator/assets/js/brand.js` and confirm:
```js
whatsapp: "2348100866322",          // your WhatsApp (intl, no +)
email: "hmgconcepts@gmail.com",     // your email
links: { ...your six sites... }
```
These flow into every generated store's footer and the generator UI.

---

## 4. Tiered offering (turn leads into revenue)

| Tier | What client gets | Your move |
|------|------------------|-----------|
| **Free / Starter** | A store with the HMG footer | Footer advertises you → inbound leads |
| **Pro (paid)** | Custom features, Supabase, your setup support | Charge a setup fee |
| **White-label (premium)** | HMG footer removed | Charge more; remove `#hmgPowered` line |

This mirrors the HMG philosophy: *cost-effective, proven, partnership-driven.*

---

## 5. Maximise reach

- **Deploy the generator publicly** (see DEPLOYMENT.md) and share its link in your portfolio and HMG
  Technologies "Products" section — it becomes another live product like CBT Pro.
- **Add StoreForge to your sites** as a featured product with a "Get a Quote" button.
- **Showcase client stores** as portfolio pieces (with permission) — social proof = more leads.
- **Encourage clients to share** their store; every share spreads your footer further.

---

## 6. Track the leads
Leads arrive via WhatsApp (pre-filled messages identify the source store). Optionally add free
**Cloudflare Web Analytics** to the generator and stores to see traffic (see FEATURES.md → E4).

---

⚡ Every store you forge is a seed. Plant many. — *HMG StoreForge*

---

## 🆕 v9 — Lead generation strengthened

Your brand is now embedded even more strongly on **every** generated client store:

1. **Footer credit** reads: *"⚡ Built by HMG Technologies · Adewale Samson Adeagbo · Get your own store 💬"*
   — linking to your site and a WhatsApp message that **names the client's store**, so prospects say
   exactly which store impressed them.
2. **Floating lead-gen badge** (bottom-left on desktop): *"🚀 Want a store like this? Chat HMG
   Technologies"* → your WhatsApp.
3. All sourced from **one place**: `generator/assets/js/brand.js` (`company`, `founder`, `site`,
   `whatsapp`, `email`). Update once → every new store carries it.

### Control it
- Keep it on (default) for free/standard stores → maximum lead flow.
- For a **premium/white-label** client who pays extra, set `leadGen.badge: false` (hides the floating
  badge) — the footer credit can also be lightened in their `config.js`.

### Tip
Because the WhatsApp message includes the client store name, you instantly know which deployment is
generating leads — great for showcasing your work and upselling more stores.

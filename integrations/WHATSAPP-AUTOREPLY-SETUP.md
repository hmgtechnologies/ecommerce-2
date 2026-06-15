# 🤖 WhatsApp Auto-Reply — Setup (Free Tier, No AI API)

Give your store a **24/7 WhatsApp auto-responder** that greets customers and offers a menu (catalog,
hours, order tracking, talk to a human). It uses **Meta's WhatsApp Cloud API** (which has a generous
**free** conversation tier) plus a **free Google Apps Script** webhook. **No AI API, no server cost.**

> This is optional and more advanced than the rest of StoreForge. If you only want simple WhatsApp
> ordering (the default), you don't need this — the store already opens WhatsApp with the full order.
> Use this when you want **automatic instant replies** even when you're offline.

---

## What you get
- Customer messages your WhatsApp → gets an **instant menu reply**.
- Replies for: **catalog link**, **store hours**, **order tracking link**, **talk to a human**.
- Fully rule-based (keyword matching) — predictable, free, and private. No AI.

---

## Step 1 — Create a Meta WhatsApp app (one-time)
1. Go to **https://developers.facebook.com** → log in → **My Apps → Create App**.
2. Choose **Business** type. Name it (e.g. "My Store WhatsApp").
3. In the app dashboard, **Add product → WhatsApp → Set up**.
4. You'll get a **test phone number**, a **Phone number ID**, and a temporary **access token**.
   - Note the **Phone number ID**.
   - For production, generate a **permanent token** (System User token) — see Meta's "Get started" guide.

## Step 2 — Create the webhook (Google Apps Script)
1. Go to **https://script.google.com → New project**.
2. Delete sample code; paste `integrations/whatsapp-autoreply.gs`.
3. Fill in at the top:
   - `VERIFY_TOKEN` — any phrase you choose (e.g. `storeforge_verify_123`).
   - `WHATSAPP_TOKEN` — your Meta access token.
   - `PHONE_NUMBER_ID` — your Meta WhatsApp phone number ID.
   - `STORE_NAME`, `STORE_URL`, `STORE_HOURS`.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me** · Who has access: **Anyone**.
   - Copy the Web app URL (ends with `/exec`).

## Step 3 — Connect the webhook to Meta
1. In Meta app dashboard → **WhatsApp → Configuration → Webhook → Edit**.
2. **Callback URL:** paste your `/exec` URL.
3. **Verify token:** the same `VERIFY_TOKEN` you set in the script.
4. Click **Verify and Save** (Meta calls your script's `doGet` to confirm).
5. **Subscribe** to the **messages** field.

## Step 4 — Test
1. Send a WhatsApp message ("hi") to your WhatsApp test/business number.
2. You should get the menu reply automatically. 🎉

---

## Notes
- **Free?** WhatsApp Cloud API includes free service conversations (customer-initiated). Normal SME
  volumes stay within the free tier. No AI API is used — replies are simple keyword rules you control.
- **Keep editing replies** in the `.gs` file → redeploy a new version (URL stays the same).
- **Privacy:** the webhook only reads incoming message text to choose a reply; nothing is stored.
- **Production number:** to message customers who haven't messaged you first, you'll register your own
  business phone number and may use approved message templates (Meta's rules) — see Meta docs.

💬 Need help wiring this up? WhatsApp HMG Technologies: https://wa.me/2348100866322

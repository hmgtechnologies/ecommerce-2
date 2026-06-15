# 📊 Google Sheets Order Logging — Setup (Free, No API Key)

Log **every order** from your store into a Google Sheet automatically, and (optionally) get an
**email per order**. 100% free — no API key, no billing, no third-party service. It uses Google's
own **Apps Script Web App**.

> Result: a live spreadsheet of all orders (customer, items, total, status, address, payment) you can
> sort, filter, and share with staff — a free, bank-grade order book.

---

## Step 1 — Create the Google Sheet
1. Open a browser and go to **https://sheets.new** (creates a new blank Google Sheet).
2. Rename it something like **"My Store Orders"** (top-left).

## Step 2 — Add the script
1. In the sheet, click **Extensions → Apps Script**.
2. Delete any sample code in the editor.
3. Open `integrations/google-sheets-orders.gs` from this project, **copy everything**, and paste it in.
4. (Optional) Near the top, set `var NOTIFY_EMAIL = "you@example.com";` to get an email per order.
   Leave it as `""` to skip emails.
5. Click the **Save** (💾) icon.

## Step 3 — Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear ⚙️ next to "Select type" → choose **Web app**.
3. Settings:
   - **Description:** `StoreForge Orders`
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone**  ← important, so your store can post orders
4. Click **Deploy**.
5. Click **Authorize access**, pick your Google account, and allow the permissions
   (you may see "Google hasn't verified this app" → **Advanced → Go to … (unsafe)** → **Allow**.
   This is YOUR own script, so it is safe.)
6. Copy the **Web app URL** — it ends with **`/exec`**.

## Step 4 — Test it
Paste the `/exec` URL into your browser. You should see:
`{"ok":true,"message":"HMG StoreForge orders endpoint is live."}`

## Step 5 — Connect it to your store
Open your store's `assets/js/config.js` and set:
```js
orders: {
  sheetsWebAppUrl: "https://script.google.com/macros/s/XXXXX/exec",
  alsoEmailFormspreeId: ""   // optional: a Formspree ID for an email backup
}
```
Re-upload `config.js` (or set it in the generator's new "Order Logging" section). Done!

Now every order placed on your store appears as a new row in your Google Sheet within seconds.

---

## Notes & FAQ
- **Is it really free?** Yes. Google Apps Script Web Apps are free for normal store volumes.
- **Is my data private?** The sheet is private to your Google account. The Web App only *accepts*
  order posts; it never exposes your sheet.
- **What if I change the script?** After editing, **Deploy → Manage deployments → Edit → New version**
  so changes take effect (the URL stays the same).
- **Orders still reach WhatsApp too.** Google Sheets logging is in *addition* to the WhatsApp order
  message and the on-device order history — nothing is lost.
- **Quota:** Apps Script allows thousands of requests/day on free accounts — plenty for SMEs.

💬 Need help? WhatsApp HMG Technologies: https://wa.me/2348100866322

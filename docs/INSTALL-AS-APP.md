# 📲 Install as an App (PWA) — Phone, Laptop & Desktop

HMG StoreForge v7 is a **Progressive Web App (PWA)**. Both the **generator platform** and **every
generated store** can be **installed like a native app** — no app store, no cost. Once installed they
get an icon on the home screen / desktop, open in their own window, and work offline-ish.

> ⚠️ Installability requires the site to be served over **HTTPS** (or `localhost`). Cloudflare Pages
> and GitHub Pages both provide free HTTPS automatically. Opening a file directly with `file://` will
> show the page but won't offer "Install".

---

## A) Install the GENERATOR (your toolchain)

After you deploy the `generator/` folder (see DEPLOYMENT.md) to e.g.
`https://storeforge-generator.pages.dev`:

### On Android (Chrome)
1. Open the generator URL in Chrome.
2. Tap the **⬇️ Install app** button in the header **or** Chrome menu (⋮) → **Install app / Add to Home screen**.
3. Confirm. The StoreForge icon appears on your home screen.

### On iPhone / iPad (Safari)
1. Open the URL in **Safari**.
2. Tap the **Share** icon → **Add to Home Screen** → **Add**.
   *(iOS installs PWAs only via Safari's "Add to Home Screen".)*

### On Windows / macOS / Linux (Chrome or Edge)
1. Open the URL in Chrome/Edge.
2. Click the **install icon** in the address bar (a small monitor/⊕ icon) **or** the **⬇️ Install app**
   button **or** menu → **Install HMG StoreForge…**.
3. It opens in its own window and gets a desktop/Start-menu shortcut.

> Offline: after first load, the generator works offline for **ZIP generation** (templates are
> embedded). One-click GitHub deploy still needs internet.

---

## B) Install a CLIENT STORE (for your client/customers)

Every generated store (and the demo) is installable the same way. Tell your client (or print on the
store's QR poster):

### Android
- Open the store → Chrome menu (⋮) → **Install app / Add to Home screen**.

### iPhone/iPad
- Open the store in **Safari** → **Share** → **Add to Home Screen**.

### Desktop
- Open the store in Chrome/Edge → address-bar **install** icon → **Install**.

Customers then launch the store like an app, get **order notifications** (if enabled), and it loads
fast even on poor connections.

---

## C) Make the QR poster do double duty
The store's **📱 Store QR Code** (v6) poster lets customers scan to open the store, then **Add to Home
Screen** to install. Print it for your shop, packaging, and flyers.

---

## Troubleshooting
| Issue | Fix |
|------|-----|
| No "Install" option | Ensure you're on **HTTPS** (Cloudflare/GitHub Pages), and using Chrome/Edge (Android/desktop) or Safari "Add to Home Screen" (iOS). |
| Install button hidden | The browser only fires the install prompt when criteria are met; use the browser menu's **Install / Add to Home screen** instead. |
| Old version after update | Close all app windows and reopen; the service worker updates on next load. |
| Works online only | First visit must be online to cache the app shell; afterwards it works offline. |

💬 Need help? WhatsApp HMG Technologies: https://wa.me/2348100866322

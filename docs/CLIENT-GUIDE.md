# 🛍️ Your Online Store — Client Guide

Welcome! Your online store was built for you with **HMG StoreForge**. This short guide shows you how
to add products, use Google Drive for pictures, and receive orders. No technical skills needed.

---

## 1. Your important links

| What | Link |
|------|------|
| Your store (customers see this) | `https://YOUR-STORE.pages.dev` |
| Your admin panel (you manage products) | `https://YOUR-STORE.pages.dev/admin.html` |
| Admin passcode | *(given to you by HMG)* |

> Keep your admin link and passcode private.

---

## 2. How to add a product (step by step)

1. Open your **admin panel** link and enter your **passcode**.
2. In **"Add a Product"**, fill in:
   - **Product name** — e.g. *Ankara Fabric (6 yards)*
   - **Category** — e.g. *Fashion*, *Electronics*, *Beauty*
   - **Price** — in Naira, numbers only (e.g. `18000`)
   - **Old price** *(optional)* — shows a SALE badge with the old price crossed out
   - **Product image** — paste a **Google Drive link** (see section 3) or any image web address
   - **Description** — sizes, colours, delivery info, etc.
   - **In stock?** and **Featured?**
3. Check the **image preview** appears correctly.
4. Click **💾 Save Product**. It appears in your product list below.
5. When done adding/editing, go to **"Save & Publish"** and click **⬇ Download products.json**.
6. Send that `products.json` file to HMG (or upload it yourself if shown how) to make it live.
   *(If your store uses Supabase, just click **Sync to Supabase** — it's instant, no upload.)*

---

## 3. How to use Google Drive for product photos (free)

1. On your phone or computer, open **Google Drive** (drive.google.com) and **upload your product photo**.
2. Tap/right-click the photo → **Share** → under "General access" choose **"Anyone with the link"**.
3. Click **Copy link**.
4. Paste that link into the **Product image** box in your admin panel.
5. StoreForge automatically turns it into a picture that shows on your store. ✅

> Tip: Use clear, well-lit photos on a plain background. Square photos look best.

---

## 4. How you receive orders

When a customer checks out, your store does one of these (depending on what they choose):

- **WhatsApp:** A message opens on YOUR WhatsApp with the full order — products, quantities, total,
  customer name, phone, and address. You reply to confirm and arrange delivery.
- **Bank transfer:** The customer sees your bank details, pays, and sends proof on WhatsApp.
- **Online payment:** If enabled, the customer pays via your Paystack/Flutterwave link, then
  messages you.

You'll always get the order details on **WhatsApp**, so nothing is missed.

---

## 5. Editing or removing a product

- In your admin panel product list, click **Edit** to change a product, or **Delete** to remove it.
- After changes, **Download products.json** again and publish (or **Sync to Supabase**).

---

## 6. Updating prices / "Out of stock"

- To mark something sold out: edit it → set **In stock? → ❌ Out of stock** → Save → publish.
- Customers will see "Out of stock" and an "Ask on WhatsApp" button instead of "Add to cart".

---

## 7. Tips for more sales

- Use the **announcement bar** for offers (ask HMG to set it, e.g. "Free delivery above ₦50,000").
- Mark your best items as **Featured ⭐**.
- Add clear descriptions and real photos.
- Share your store link on WhatsApp status, Instagram, and Facebook.

---

## 🆕 v2 features you can use

- **Bulk upload products:** Admin → **Bulk CSV** tab → Download template → fill it in Excel/Google
  Sheets → Import. Great for adding many products fast.
- **Dashboard:** Admin → **Dashboard** tab shows your revenue, top products, and low-stock items.
- **Orders:** Admin → **Orders** tab lists orders, lets you change status, and message the customer.
- **Backup:** Admin → **Publish** tab → **Download full backup** keeps a safe copy of everything.
- **Discounts & delivery:** Ask HMG to set coupon codes (e.g. WELCOME10) and delivery-zone fees, or
  edit `assets/js/config.js`.
- **Stock count, variants, multiple photos:** add these when creating a product (quantity, sizes/
  colours, extra image links).
- **Customers can:** save favourites ❤️, leave reviews ⭐, and track their order at
  `yourstore.pages.dev/track.html`.
- **Install as an app:** customers can "Add to Home Screen" — your store works like a mobile app.

---

## Need help or changes?
Contact **HMG Technologies** on WhatsApp: **+234 810 086 6322** · https://wa.me/2348100866322

⚡ Your store is powered by **HMG StoreForge**.

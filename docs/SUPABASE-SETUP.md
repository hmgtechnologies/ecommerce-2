# 🗄️ Supabase Setup (Optional Live Database) — HMG StoreForge

Supabase gives your store a **real, free database** so products update instantly (no file re-upload)
and orders can be stored. This is **optional** — stores work fine with the free JSON catalog. Use
Supabase for active, growing stores.

> Free tier limits (generous for small/medium stores): 500 MB database, 5 GB bandwidth, unlimited
> API requests. No credit card required.

---

## Step 1 — Create a project
1. Go to https://supabase.com → **Start your project** → sign in with GitHub.
2. Click **New project**. Choose a name (e.g. `bellas-fashion-db`), a strong database password, and a
   region close to Nigeria (e.g. **West EU (London)** is usually fastest from Nigeria).
3. Wait ~2 minutes for provisioning.

## Step 2 — Create the tables
1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy ALL of it, paste into the editor.
3. Click **Run**. You should see "Success". This creates the `products` and `orders` tables with
   security policies and demo data.

## Step 3 — Get your API keys
1. Sidebar → **Project Settings** (gear) → **API**.
2. Copy:
   - **Project URL** → looks like `https://abcdxyz.supabase.co`
   - **anon public** key → a long string starting with `eyJ...`
3. ⚠️ **Never** use or share the `service_role` key in the website. Only the **anon public** key
   goes into the store (it is safe to expose and is restricted by the security policies).

## Step 4 — Put the keys in the store
**During generation:** paste the URL and anon key into the generator's "Data Backend" section.

**After generation:** open `assets/js/config.js` and set:
```js
supabase: {
  url: "https://abcdxyz.supabase.co",
  anonKey: "eyJhbGciOi...your-anon-key...",
  table: "products"
}
```
Re-upload `config.js` to the repo. The store now loads products live from Supabase.

## Step 5 — Manage products (two easy ways)
**Option A — Supabase Table Editor (no code, recommended):**
Sidebar → **Table Editor** → `products` → **Insert row**. Fill name, price, category, `image_url`
(a direct link or Google Drive link), set `active = true`. Save. It appears on the store immediately.

**Option B — Admin panel sync:**
In `admin.html`, add products, then click **☁️ Sync to Supabase**.
> Note: writing with the public anon key requires a permissive insert policy. By default the schema
> blocks public writes for safety. For Option B to write directly, either (1) use the Table Editor
> instead, or (2) enable the optional "admin manage products" policy in `schema.sql` and sign in as
> an authenticated admin. For most clients, **Option A (Table Editor)** is simplest and safest.

## Step 6 — (Optional) Capture orders in the database
The `orders` table accepts public inserts (customers submitting orders). To send orders there in
addition to WhatsApp, you can extend `store.js` `placeOrder()` with a `fetch` POST to
`/rest/v1/orders`. Ask HMG to enable this if you want a full order log in Supabase.

---

## Security summary
- ✅ **anon public** key in the store — safe, read-only for active products.
- ❌ **service_role** key — never in the browser. Keep it secret.
- ✅ Row-Level Security is ON; customers can only read active products and insert their own orders.

💬 Need help? WhatsApp HMG: https://wa.me/2348100866322

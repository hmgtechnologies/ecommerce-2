# 🛠️ Troubleshooting — HMG StoreForge

Common issues and clear fixes. If you're still stuck, WhatsApp HMG: https://wa.me/2348100866322

---

## Generator

**Q: I click "Generate" but nothing downloads.**
- Check the status message under the button. Ensure **Store name, Store ID, and WhatsApp** are filled.
- If it says "ZIP library blocked", you're offline or a network blocked the JSZip CDN. Connect to the
  internet and retry, or use the **CLI generator** (`cli/generate.js`) which needs no internet.

**Q: The downloaded ZIP is missing images.**
- Images are embedded in `generator/assets/js/templates.js`. If you edited the template images, re-run
  the build step (see below) so they're re-embedded.

**Q: How do I re-embed updated template files into the browser generator?**
- From `e-commerce/`, run the helper that rebuilds `templates.js` from `store-template/` (a Python
  one-liner is documented in the project; or simply re-copy the files). The CLI generator always uses
  the live `store-template/` folder directly, so it's always current.

---

## Generated store

**Q: The store shows "Loading products…" forever.**
- If using Supabase: check the URL and anon key in `config.js`, and that you ran `schema.sql`.
- If using JSON: ensure `products.json` exists at the repo root and is valid JSON.
- The store falls back to built-in demo products if both fail — if you see demo products, your config
  isn't pointing at real data yet.

**Q: Product images don't show (broken image).**
- For Google Drive: the file must be shared as **"Anyone with the link"**. Re-copy the link.
- Very large images may load slowly; resize to ~1000px wide.
- The store shows the placeholder image if a URL fails — replace the link.

**Q: WhatsApp button opens the wrong number / says invalid.**
- The number must be **international format with no `+` or spaces**, e.g. `2348012345678`.
- Fix it in `config.js` → `whatsapp` and re-upload.

**Q: Cart is empty after refresh on a different phone.**
- The cart is stored per-browser (localStorage). That's expected — it's not shared across devices.

**Q: Dark mode looks off on one section.**
- Clear the browser theme: open dev console and run `localStorage.removeItem('sf_theme')`, then
  reload. Report persistent issues to HMG.

---

## Admin panel

**Q: My passcode doesn't work.**
- The default is `admin1234` unless you set another in the generator. It's stored in `admin.html` as
  `const ADMIN_PASS = "...";` — open the file to check/change it, then re-upload.

**Q: I added products but the store doesn't show them.**
- In JSON mode you must **Download products.json** and **upload it to GitHub** (replace the old one).
  Wait ~1 minute for redeploy. The admin's local edits don't auto-publish.
- In Supabase mode, use the **Table Editor** (most reliable) or **Sync to Supabase**.

**Q: "Sync to Supabase" fails.**
- By default the database blocks public writes for security. Use the Supabase **Table Editor** to add
  products, or enable the optional admin policy in `schema.sql` (see SUPABASE-SETUP.md).

---

## Deployment

**Q: Cloudflare shows a blank page or 404.**
- Ensure `index.html` is at the **repo root**, not inside a sub-folder.
- Build output directory should be `/` and build command empty.

**Q: On GitHub Pages, links/styles are broken.**
- GitHub Pages serves under `/<repo>/`. StoreForge uses relative paths, which usually works. If not,
  prefer **Cloudflare Pages** (no sub-path). 

**Q: My changes aren't showing.**
- Hard-refresh (Ctrl/Cmd+Shift+R). Cloudflare redeploys on each GitHub commit — check the Pages
  dashboard for the latest deployment status.

---

## Adding free analytics (optional)
**Cloudflare Web Analytics:** dashboard → Analytics → Web Analytics → add your site → paste the one
`<script>` snippet just before `</body>` in `index.html`. No cookie banner needed.

💬 Still stuck? WhatsApp HMG Technologies: https://wa.me/2348100866322

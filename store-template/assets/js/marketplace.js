/* ============================================================================
 * HMG StoreForge v5 — Multi-Vendor Marketplace (marketplace.js)
 * ----------------------------------------------------------------------------
 * Turns a single-vendor store into a Jumia/Jiji-style MARKETPLACE where many
 * vendors list products. Activated only when cfg.marketplace.enabled === true,
 * so single-vendor stores are completely unaffected (backward compatible).
 *
 * Each product gains an optional "vendor" id. Vendors are defined in
 * cfg.marketplace.vendors = [{ id, name, whatsapp, location, rating, logo }].
 *
 * Features:
 *   • Vendor filter pills + vendor badge on product cards
 *   • Vendor info in the product modal (name, rating, "chat this vendor")
 *   • Vendor directory section
 *   • Order splitting: each vendor receives ONLY their items on THEIR WhatsApp
 *   • Per-vendor ratings (display)
 *
 * 100% free, no paid APIs. Loaded after store.js + extras.
 * ==========================================================================*/

const Marketplace = (function () {
  const cfg = window.STORE_CONFIG || {};
  const mp = cfg.marketplace || {};
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");

  function enabled() { return !!mp.enabled; }
  function vendors() { return mp.vendors || []; }
  function vendorById(id) { return vendors().find(v => v.id === id) || null; }

  let activeVendor = "";

  /* ---------- Vendor directory + filter pills ---------- */
  function render() {
    if (!enabled()) return;
    const list = vendors();
    // Vendor filter pills (injected into #vendorPills)
    const pills = $("#vendorPills");
    if (pills) {
      pills.innerHTML =
        `<span class="vendor-pill ${!activeVendor ? "active" : ""}" onclick="Marketplace.filter('')">All vendors</span>` +
        list.map(v => `<span class="vendor-pill ${activeVendor === v.id ? "active" : ""}" onclick="Marketplace.filter('${v.id}')">🏪 ${esc(v.name)}</span>`).join("");
    }
    // Vendor directory cards
    const dir = $("#vendorDirectory");
    if (dir) {
      $("#vendorSection").hidden = list.length === 0;
      dir.innerHTML = list.map(v => `
        <div class="vendor-card">
          <img src="${v.logo || "assets/images/logo.png"}" alt="${esc(v.name)}" onerror="this.src='assets/images/logo.png'">
          <div class="vc-body">
            <strong>${esc(v.name)}</strong>
            <div class="vc-rating">${stars(v.rating || 5)} <small>${(v.rating || 5).toFixed(1)}</small></div>
            <small class="vc-loc">📍 ${esc(v.location || "")}</small>
            <div class="vc-actions">
              <button class="btn btn-outline" onclick="Marketplace.filter('${v.id}');document.getElementById('products').scrollIntoView({behavior:'smooth'})">View products</button>
              <a class="btn btn-primary" target="_blank" href="https://wa.me/${(v.whatsapp||cfg.whatsapp)}?text=${encodeURIComponent('Hi '+v.name+'! I saw your shop on '+cfg.storeName)}">💬 Chat</a>
            </div>
          </div>
        </div>`).join("");
    }
    decorateCards();
  }

  function stars(n) { const f = Math.round(n); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); }

  /* ---------- Add vendor badge to product cards ---------- */
  function decorateCards() {
    if (!enabled()) return;
    const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
    document.querySelectorAll("#productGrid .product-card").forEach(card => {
      // find product by its add/notify button data, fallback to name match
      const nameEl = card.querySelector(".pc-name");
      if (!nameEl) return;
      const p = products.find(x => x.name === nameEl.textContent);
      if (!p || !p.vendor) return;
      const v = vendorById(p.vendor); if (!v) return;
      if (card.querySelector(".vendor-badge")) return;
      const badge = document.createElement("div");
      badge.className = "vendor-badge";
      badge.innerHTML = `🏪 ${esc(v.name)}`;
      card.querySelector(".pc-body")?.prepend(badge);
    });
  }

  /* ---------- Filter products by vendor (hides non-matching cards) ---------- */
  function filter(vendorId) {
    activeVendor = vendorId;
    const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
    document.querySelectorAll("#productGrid .product-card").forEach(card => {
      const nameEl = card.querySelector(".pc-name"); if (!nameEl) return;
      const p = products.find(x => x.name === nameEl.textContent);
      const show = !vendorId || (p && p.vendor === vendorId);
      card.style.display = show ? "" : "none";
    });
    render();
  }

  /* ---------- Product-modal vendor block (called by a hook) ---------- */
  function vendorBlock(product) {
    if (!enabled() || !product.vendor) return "";
    const v = vendorById(product.vendor); if (!v) return "";
    return `<div class="mp-vendor">
      <img src="${v.logo || "assets/images/logo.png"}" onerror="this.src='assets/images/logo.png'">
      <div><strong>Sold by ${esc(v.name)}</strong><br>
      <small>${stars(v.rating || 5)} · 📍 ${esc(v.location || "")}</small></div>
      <a class="btn btn-outline" target="_blank" href="https://wa.me/${(v.whatsapp||cfg.whatsapp)}?text=${encodeURIComponent('Hi '+v.name+'! About '+product.name)}">💬 Chat vendor</a>
    </div>`;
  }

  /* ---------- Order splitting: group cart by vendor, message each vendor ---------- */
  function splitOrder(order) {
    if (!enabled()) return false;
    const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
    // group items by vendor
    const groups = {};
    (order.items || []).forEach(it => {
      const p = products.find(x => x.name === it.name);
      const vid = (p && p.vendor) || "_store";
      (groups[vid] = groups[vid] || []).push(it);
    });
    const vendorIds = Object.keys(groups);
    // If everything belongs to one vendor (or none), let the normal flow handle it
    if (vendorIds.length <= 1) return false;

    // Open a WhatsApp message per vendor with only their items
    vendorIds.forEach((vid, i) => {
      const v = vendorById(vid);
      const wa = (v && v.whatsapp) || cfg.whatsapp;
      const items = groups[vid].map(it => `• ${it.name} × ${it.qty} = ${fmt(it.price * it.qty)}`).join("\n");
      const subtotal = groups[vid].reduce((s, it) => s + it.price * it.qty, 0);
      const msg = `🧾 ORDER ${order.id} (part ${i + 1}/${vendorIds.length})\n` +
        `Marketplace: ${cfg.storeName}\n` + (v ? `Vendor: ${v.name}\n` : "") + `\n${items}\nSubtotal: ${fmt(subtotal)}\n\n` +
        `👤 ${order.customer}\n📞 ${order.phone}\n📍 ${order.address}\n💰 ${order.method}`;
      // stagger window.open so popups aren't blocked
      setTimeout(() => window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank"), i * 400);
    });
    return true; // handled
  }

  function init() {
    if (!enabled()) return;
    render();
    // re-decorate when grid re-renders
    const grid = $("#productGrid");
    if (grid) new MutationObserver(() => decorateCards()).observe(grid, { childList: true });
  }

  return { enabled, vendors, vendorById, render, filter, vendorBlock, splitOrder, init };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { Marketplace.init(); } catch (e) { console.warn(e); } }, 500));

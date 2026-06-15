/* ============================================================================
 * HMG StoreForge v4 — Store Extras 3 (store-extras3.js)
 * ----------------------------------------------------------------------------
 * Adds v4 ENTERPRISE features on top of v1/v2/v3, without modifying earlier files:
 *   • Google Sheets order logging (free Apps Script webhook)
 *   • Loyalty points (earn on orders, shown in header)
 *   • "Notify me when back in stock" (captures email/WhatsApp)
 *   • Flash-sale countdown timer
 *   • Recently-sold social-proof toasts ("Someone just bought X")
 *   • Product comparison drawer
 *   • Trust badges strip
 *   • Estimated delivery date in checkout
 *   • Language switcher (English / Nigerian Pidgin)
 *
 * 100% free, no paid APIs. Degrades gracefully if config is missing.
 * Loaded AFTER store.js, store-extras.js, store-extras2.js.
 * ==========================================================================*/

const StoreForgeV4 = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t4); t._t4 = setTimeout(() => t.classList.remove("show"), 2400); };

  /* ---------------- GOOGLE SHEETS ORDER LOGGING ---------------- */
  // Called by store.js after an order is placed (window event 'sf:order').
  async function logOrderToSheets(order) {
    const o = cfg.orders || {};
    if (o.sheetsWebAppUrl) {
      try {
        // 'no-cors' lets us POST to Apps Script without CORS errors; we can't read the
        // response, but the row is written. This is the standard free pattern.
        await fetch(o.sheetsWebAppUrl, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ ...order, store: cfg.storeName })
        });
      } catch (e) { console.warn("Sheets log failed", e); }
    }
    // Optional email backup via Formspree
    if (o.alsoEmailFormspreeId) {
      try {
        await fetch("https://formspree.io/f/" + o.alsoEmailFormspreeId, {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ subject: "New order " + order.id, ...order, store: cfg.storeName })
        });
      } catch (e) {}
    }
  }

  /* ---------------- LOYALTY POINTS ---------------- */
  const Loyalty = {
    key: "sf_points_" + sid,
    get: () => lsGet(Loyalty.key, 0),
    earn(total) {
      const rate = (cfg.loyalty && cfg.loyalty.pointsPerNaira) || 0.001; // 1 pt per ₦1000 default
      const pts = Math.floor((total || 0) * rate);
      lsSet(Loyalty.key, Loyalty.get() + pts); Loyalty.render();
      if (pts > 0) toast(`⭐ You earned ${pts} loyalty point${pts !== 1 ? "s" : ""}!`);
    },
    render() {
      const el = $("#loyaltyBadge"); if (!el) return;
      if (!cfg.loyalty || !cfg.loyalty.enabled) { el.hidden = true; return; }
      el.hidden = false; el.textContent = `⭐ ${Loyalty.get()} pts`;
      el.title = "Loyalty points — show this at checkout to redeem";
    }
  };

  /* ---------------- NOTIFY WHEN BACK IN STOCK ---------------- */
  function notifyBackInStock(productName) {
    const contact = prompt(`Enter your WhatsApp number or email — we'll notify you when "${productName}" is back in stock:`);
    if (!contact) return;
    const list = lsGet("sf_notify_" + sid, []); list.push({ product: productName, contact, date: new Date().toISOString() });
    lsSet("sf_notify_" + sid, list);
    // Also ping the seller on WhatsApp so they have the request
    const msg = `🔔 Restock request: please notify me when "${productName}" is back in stock. Contact: ${contact}`;
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    toast("✅ We'll let you know!");
  }

  /* ---------------- FLASH SALE COUNTDOWN ---------------- */
  function renderFlashSale() {
    const fs = cfg.flashSale; const bar = $("#flashSale"); if (!bar) return;
    if (!fs || !fs.enabled || !fs.endsAt) { bar.hidden = true; return; }
    const end = new Date(fs.endsAt).getTime();
    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) { bar.hidden = true; clearInterval(bar._iv); return; }
      const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24,
            m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
      bar.hidden = false;
      bar.innerHTML = `⚡ <strong>${esc(fs.title || "Flash Sale!")}</strong> ends in
        <span class="cd">${d}d ${h}h ${m}m ${s}s</span>`;
    }
    tick(); bar._iv = setInterval(tick, 1000);
  }

  /* ---------------- RECENTLY-SOLD SOCIAL PROOF ---------------- */
  function startSocialProof() {
    if (!cfg.socialProof || !cfg.socialProof.enabled) return;
    const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
    if (!products.length) return;
    const names = ["Chioma", "Tunde", "Aisha", "Emeka", "Bola", "Ngozi", "Yusuf", "Funke", "Ifeanyi", "Zainab"];
    const places = ["Lagos", "Abuja", "Ibadan", "Port Harcourt", "Kano", "Benin", "Enugu"];
    function show() {
      const p = products[Math.floor(Math.random() * products.length)];
      const n = names[Math.floor(Math.random() * names.length)];
      const pl = places[Math.floor(Math.random() * places.length)];
      const el = $("#socialProof"); if (!el) return;
      el.innerHTML = `🛍️ <strong>${n}</strong> from ${pl} just bought <strong>${esc(p.name)}</strong>`;
      el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 5000);
    }
    setTimeout(function loop() { show(); setTimeout(loop, 12000 + Math.random() * 10000); }, 8000);
  }

  /* ---------------- PRODUCT COMPARISON ---------------- */
  const Compare = {
    key: "sf_compare_" + sid,
    list: () => lsGet(Compare.key, []),
    toggle(id) {
      let l = Compare.list();
      if (l.includes(id)) l = l.filter(x => x !== id);
      else { if (l.length >= 4) { toast("Compare up to 4 items"); return; } l.push(id); }
      lsSet(Compare.key, l); Compare.renderBtn();
      toast(l.includes(id) ? "Added to compare" : "Removed from compare");
    },
    renderBtn() {
      const b = $("#compareBtn"); if (!b) return;
      const n = Compare.list().length; b.hidden = n === 0;
      b.textContent = `⚖️ Compare (${n})`;
    },
    open() {
      const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
      const items = Compare.list().map(id => products.find(p => p.id === id)).filter(Boolean);
      if (!items.length) { toast("Nothing to compare"); return; }
      const rows = [
        ["Image", items.map(p => `<img src="${p.image}" style="width:70px;height:70px;object-fit:cover;border-radius:8px" onerror="this.src='assets/images/placeholder.png'">`)],
        ["Name", items.map(p => `<strong>${esc(p.name)}</strong>`)],
        ["Price", items.map(p => fmt(p.price))],
        ["Category", items.map(p => esc(p.category))],
        ["In stock", items.map(p => p.stock ? "✅ Yes" : "❌ No")],
        ["", items.map(p => `<button class="btn btn-primary" style="font-size:.78rem;padding:.4rem" onclick="StoreForge.addToCart('${p.id}')">Add to cart</button>`)]
      ];
      $("#genericModalBody").innerHTML = `<h2>⚖️ Compare Products</h2>
        <div style="overflow-x:auto"><table class="compare-table"><tbody>
        ${rows.map(([label, cells]) => `<tr><th>${label}</th>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
        </tbody></table></div>
        <button class="btn btn-text btn-block" onclick="StoreForgeV4.clearCompare()">Clear comparison</button>`;
      $("#genericOverlay").classList.add("open"); $("#genericModal").classList.add("open");
    },
    clear() { lsSet(Compare.key, []); Compare.renderBtn(); if (window.StoreForgeV3) StoreForgeV3.closeGeneric(); }
  };

  /* ---------------- TRUST BADGES ---------------- */
  function renderTrustBadges() {
    const sec = $("#trustBadges"); if (!sec) return;
    const badges = (cfg.trustBadges && cfg.trustBadges.length) ? cfg.trustBadges : [
      { icon: "🚚", title: "Fast Delivery", text: "Nationwide, 1–5 days" },
      { icon: "🔒", title: "Secure Payment", text: "Bank transfer & Paystack" },
      { icon: "↩️", title: "Easy Returns", text: "48-hour return window" },
      { icon: "💬", title: "Real Support", text: "Chat with us on WhatsApp" }
    ];
    sec.innerHTML = badges.map(b => `
      <div class="trust-badge"><span class="tb-ico">${b.icon}</span>
      <div><strong>${esc(b.title)}</strong><small>${esc(b.text)}</small></div></div>`).join("");
  }

  /* ---------------- ESTIMATED DELIVERY ---------------- */
  function estimatedDelivery() {
    const days = (cfg.delivery && cfg.delivery.estimatedDays) || 3;
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "short" });
  }

  /* ---------------- LANGUAGE SWITCHER (EN / Pidgin) ---------------- */
  const I18N = {
    en: { shop: "Shop", cart: "Your Cart", checkout: "Proceed to Checkout →", add: "Add to cart", contact: "Contact Us" },
    pcm: { shop: "Buy", cart: "Your Basket", checkout: "Make I Pay →", add: "Put for basket", contact: "Yarn Us" }
  };
  function setLang(lang) {
    lsSet("sf_lang_" + sid, lang);
    const t = I18N[lang] || I18N.en;
    // Light-touch translation of a few key labels (safe, optional)
    $$("[data-i18n]").forEach(el => { const k = el.getAttribute("data-i18n"); if (t[k]) el.textContent = t[k]; });
    $$(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    if ($("#checkoutBtn") && t.checkout) $("#checkoutBtn").textContent = t.checkout;
  }
  function renderLangSwitcher() {
    const el = $("#langSwitch"); if (!el || !cfg.languages || !cfg.languages.enabled) return;
    el.hidden = false;
    el.innerHTML = `<button class="lang-btn active" data-lang="en" onclick="StoreForgeV4.setLang('en')">EN</button>
      <button class="lang-btn" data-lang="pcm" onclick="StoreForgeV4.setLang('pcm')">Pidgin</button>`;
    const saved = lsGet("sf_lang_" + sid, "en"); if (saved !== "en") setLang(saved);
  }

  /* ---------------- INIT ---------------- */
  function init() {
    Loyalty.render(); renderFlashSale(); startSocialProof();
    Compare.renderBtn(); renderTrustBadges(); renderLangSwitcher();
    const cb = $("#compareBtn"); if (cb) cb.onclick = Compare.open;
    // listen for orders placed (dispatched by store.js)
    window.addEventListener("sf:order", (e) => {
      const order = e.detail;
      logOrderToSheets(order);
      if (cfg.loyalty && cfg.loyalty.enabled) Loyalty.earn(order.total);
    });
    // add compare buttons to product cards (delegated)
    document.addEventListener("click", (e) => {
      const c = e.target.closest("[data-compare]");
      if (c) { e.preventDefault(); Compare.toggle(c.getAttribute("data-compare")); }
      const n = e.target.closest("[data-notify]");
      if (n) { e.preventDefault(); notifyBackInStock(n.getAttribute("data-notify")); }
    });
  }

  return {
    init, logOrderToSheets, notifyBackInStock, estimatedDelivery,
    setLang, toggleCompare: (id) => Compare.toggle(id), openCompare: () => Compare.open(),
    clearCompare: () => Compare.clear(), Loyalty
  };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { StoreForgeV4.init(); } catch (e) { console.warn(e); } }, 400));

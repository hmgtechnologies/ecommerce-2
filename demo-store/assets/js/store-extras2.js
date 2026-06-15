/* ============================================================================
 * HMG StoreForge v3 — Store Extras 2 (store-extras2.js)
 * ----------------------------------------------------------------------------
 * Adds v3 ENTERPRISE features on top of v1/v2, without modifying earlier files:
 *   • Store open/closed indicator (business hours)
 *   • FAQ accordion section
 *   • Testimonials section
 *   • Multi-currency display switcher (informational)
 *   • Price-range filter (min/max)
 *   • Coupon auto-apply via URL (?coupon=CODE)
 *   • Returns policy modal
 *   • Print / save order receipt
 *   • Lightweight customer "account" (name/phone remembered, order history)
 *   • WhatsApp catalog export (share whole catalog)
 *
 * 100% free, no paid APIs. Everything degrades gracefully if config is missing.
 * Loaded AFTER store.js and store-extras.js.
 * ==========================================================================*/

const StoreForgeV3 = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t3); t._t3 = setTimeout(() => t.classList.remove("show"), 2200); };

  /* ---------------- STORE HOURS ---------------- */
  function isOpenNow() {
    const h = cfg.hours; if (!h || !h.enabled) return null;
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let now = new Date();
    try { now = new Date(now.toLocaleString("en-US", { timeZone: h.timezone || "Africa/Lagos" })); } catch {}
    const today = days[now.getDay()];
    const range = (h.schedule || {})[today];
    if (!range) return { open: false, label: "Closed today" };
    const [o, c] = range;
    const toMin = (s) => { const [hh, mm] = s.split(":").map(Number); return hh * 60 + mm; };
    const cur = now.getHours() * 60 + now.getMinutes();
    const open = cur >= toMin(o) && cur < toMin(c);
    return { open, label: open ? `Open now · until ${c}` : `Closed · opens ${o}` };
  }
  function renderHours() {
    const st = isOpenNow(); const el = $("#storeHours"); if (!el || !st) return;
    el.hidden = false;
    el.innerHTML = `<span class="hours-dot ${st.open ? "open" : "closed"}"></span>${st.label}`;
  }

  /* ---------------- FAQ ---------------- */
  function renderFAQ() {
    const list = cfg.faq || []; const sec = $("#faqSection"); if (!sec) return;
    if (!list.length) { sec.hidden = true; return; }
    $("#faqList").innerHTML = list.map((f, i) => `
      <div class="faq-item">
        <button class="faq-q" onclick="StoreForgeV3.toggleFAQ(${i})">${esc(f.q)}<span class="faq-ic" id="faqic${i}">+</span></button>
        <div class="faq-a" id="faqa${i}">${esc(f.a)}</div>
      </div>`).join("");
  }
  function toggleFAQ(i) {
    const a = $("#faqa" + i), ic = $("#faqic" + i);
    const open = a.classList.toggle("open"); if (ic) ic.textContent = open ? "−" : "+";
  }

  /* ---------------- TESTIMONIALS ---------------- */
  function renderTestimonials() {
    const list = cfg.testimonials || []; const sec = $("#testimonialSection"); if (!sec) return;
    if (!list.length) { sec.hidden = true; return; }
    $("#testimonialGrid").innerHTML = list.map(t => `
      <div class="testimonial">
        <div class="t-stars">${"★".repeat(t.rating || 5)}${"☆".repeat(5 - (t.rating || 5))}</div>
        <p>"${esc(t.text)}"</p><strong>— ${esc(t.name)}</strong>
      </div>`).join("");
  }

  /* ---------------- MULTI-CURRENCY ---------------- */
  let activeCurrency = lsGet("sf_currency_" + sid, (cfg.currencies && cfg.currencies.base) || "NGN");
  function convert(ngn) {
    const c = cfg.currencies; if (!c) return null;
    const rate = (c.rates || {})[activeCurrency] || 1;
    const sym = (c.symbols || {})[activeCurrency] || "";
    if (activeCurrency === c.base) return null;
    const val = ngn * rate;
    return sym + val.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  function renderCurrencySwitcher() {
    const c = cfg.currencies; const el = $("#currencySwitch"); if (!el || !c) return;
    el.hidden = false;
    el.innerHTML = Object.keys(c.rates).map(cur =>
      `<button class="cur-btn ${cur === activeCurrency ? "active" : ""}" onclick="StoreForgeV3.setCurrency('${cur}')">${cur}</button>`).join("");
    annotatePrices();
  }
  function setCurrency(cur) { activeCurrency = cur; lsSet("sf_currency_" + sid, cur); renderCurrencySwitcher(); }
  function annotatePrices() {
    // Add a secondary currency line under each NGN price (informational)
    if (!cfg.currencies || activeCurrency === cfg.currencies.base) {
      $$(".cur-alt").forEach(e => e.remove()); return;
    }
    $$(".pc-price").forEach(el => {
      const ngn = parseInt((el.textContent || "").replace(/[^\d]/g, "")) || 0;
      let alt = el.querySelector(".cur-alt");
      if (!alt) { alt = document.createElement("small"); alt.className = "cur-alt"; el.appendChild(alt); }
      const c = convert(ngn); alt.textContent = c ? " ≈ " + c : "";
    });
  }

  /* ---------------- PRICE-RANGE FILTER ---------------- */
  function bindPriceFilter() {
    const min = $("#priceMin"), max = $("#priceMax"), apply = $("#priceApply"), clear = $("#priceClear");
    if (!apply) return;
    apply.onclick = () => {
      const lo = parseInt(min.value) || 0, hi = parseInt(max.value) || Infinity;
      // Hide product cards outside range (works with StoreForge rendered grid)
      $$("#productGrid .product-card").forEach(card => {
        const p = parseInt((card.querySelector(".pc-price")?.textContent || "").replace(/[^\d]/g, "")) || 0;
        card.style.display = (p >= lo && p <= hi) ? "" : "none";
      });
      toast("Filtered by price");
    };
    if (clear) clear.onclick = () => { min.value = ""; max.value = ""; $$("#productGrid .product-card").forEach(c => c.style.display = ""); };
  }

  /* ---------------- COUPON AUTO-APPLY via URL ---------------- */
  function autoCoupon() {
    const params = new URLSearchParams(location.search);
    const code = params.get("coupon");
    if (code) { lsSet("sf_autocoupon_" + sid, code); toast(`🎟️ Coupon ${code} ready at checkout`); }
  }
  function pendingCoupon() { return lsGet("sf_autocoupon_" + sid, ""); }

  /* ---------------- RETURNS POLICY ---------------- */
  function showReturns() {
    const body = $("#genericModalBody"); if (!body) return;
    body.innerHTML = `<h2>↩️ Returns & Refunds</h2><p style="white-space:pre-line;margin-top:.6rem">${esc(cfg.returnsPolicy || "Contact us on WhatsApp for returns.")}</p>
      <a class="btn btn-primary btn-block" style="margin-top:1rem" target="_blank" href="https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent("Hi! I'd like to start a return.")}">💬 Start a return on WhatsApp</a>`;
    openGeneric();
  }
  function openGeneric() { $("#genericOverlay").classList.add("open"); $("#genericModal").classList.add("open"); }
  function closeGeneric() { $("#genericOverlay").classList.remove("open"); $("#genericModal").classList.remove("open"); }

  /* ---------------- PRINT RECEIPT (latest order) ---------------- */
  function printLatestReceipt() {
    const orders = lsGet("sfp_orders_" + sid, []);
    if (!orders.length) { toast("No orders to print"); return; }
    printReceipt(orders[0]);
  }
  function printReceipt(o) {
    const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
    const rows = (o.items || []).map(i => `<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td style="text-align:right">${fmt(i.price * i.qty)}</td></tr>`).join("");
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Receipt ${esc(o.id)}</title>
      <style>body{font-family:system-ui,Arial;padding:24px;color:#1b2733}h1{font-size:1.3rem}
      table{width:100%;border-collapse:collapse;margin:1rem 0}td,th{padding:.4rem;border-bottom:1px solid #ddd;text-align:left}
      .tot{font-weight:700;font-size:1.1rem}.muted{color:#777}</style></head><body>
      <h1>${esc(cfg.storeName)}</h1><p class="muted">Receipt · ${esc(o.id)} · ${new Date(o.date).toLocaleString()}</p>
      <p>Customer: ${esc(o.customer || "")} · ${esc(o.phone || "")}<br>Address: ${esc(o.address || "")}</p>
      <table><tr><th>Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr>${rows}
      ${o.discount ? `<tr><td colspan="2">Discount</td><td style="text-align:right">−${fmt(o.discount)}</td></tr>` : ""}
      ${o.delivery ? `<tr><td colspan="2">Delivery${o.zone ? " (" + esc(o.zone) + ")" : ""}</td><td style="text-align:right">${fmt(o.delivery)}</td></tr>` : ""}
      <tr class="tot"><td colspan="2">TOTAL</td><td style="text-align:right">${fmt(o.total)}</td></tr></table>
      <p class="muted">Payment: ${esc(o.method || "")} · Status: ${esc(o.status || "pending")}</p>
      <p class="muted">⚡ Powered by HMG StoreForge</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
  }

  /* ---------------- CUSTOMER ACCOUNT (lightweight) ---------------- */
  const Account = {
    get: () => lsGet("sf_customer_" + sid, null),
    save(name, phone) { lsSet("sf_customer_" + sid, { name, phone }); },
    prefill() {
      const a = Account.get(); if (!a) return;
      const n = $("#coName"), p = $("#coPhone");
      if (n && !n.value) n.value = a.name || "";
      if (p && !p.value) p.value = a.phone || "";
    }
  };

  /* ---------------- WHATSAPP CATALOG EXPORT ---------------- */
  function shareCatalog() {
    const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
    const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
    const lines = products.slice(0, 30).map(p => `• ${p.name} — ${fmt(p.price)}`).join("\n");
    const msg = `🛍️ ${cfg.storeName} catalog:\n\n${lines}\n\nShop: ${cfg.storeUrl || location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  /* ---------------- INIT ---------------- */
  function init() {
    renderHours(); renderFAQ(); renderTestimonials();
    renderCurrencySwitcher(); bindPriceFilter(); autoCoupon();
    // Re-annotate prices whenever the grid re-renders (search/filter)
    const grid = $("#productGrid");
    if (grid) new MutationObserver(() => annotatePrices()).observe(grid, { childList: true });
    // bind buttons that may exist
    const sc = $("#shareCatalogBtn"); if (sc) sc.onclick = shareCatalog;
    const pr = $("#printReceiptBtn"); if (pr) pr.onclick = printLatestReceipt;
    // refresh hours every minute
    setInterval(renderHours, 60000);
  }

  return {
    init, toggleFAQ, setCurrency, showReturns, closeGeneric,
    printReceipt, printLatestReceipt, shareCatalog, Account, pendingCoupon
  };
})();

// Auto-init after everything else is ready
document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { StoreForgeV3.init(); } catch (e) { console.warn(e); } }, 300));

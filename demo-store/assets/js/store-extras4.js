/* ============================================================================
 * HMG StoreForge v5 — Store Extras 4 (store-extras4.js)
 * ----------------------------------------------------------------------------
 * Adds: gift cards / store credit, referral links, and an advanced filter
 * (rating + in-stock). All free, all client-side. Loaded after store + extras.
 * ==========================================================================*/

const StoreForgeV5 = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t5); t._t5 = setTimeout(() => t.classList.remove("show"), 2200); };

  /* ---------------- GIFT CARDS / STORE CREDIT ---------------- */
  let appliedGift = null;
  function getCards() { return cfg.giftCards || []; }
  function applyGiftCard(code) {
    const c = getCards().find(x => x.code.toUpperCase() === (code || "").trim().toUpperCase());
    if (!c) { appliedGift = null; return { ok: false, msg: "Invalid gift code" }; }
    appliedGift = c; return { ok: true, msg: `Gift card applied: −${fmt(c.value)}` };
  }
  function giftValue() { return appliedGift ? Number(appliedGift.value) || 0 : 0; }

  /* ---------------- REFERRAL / AFFILIATE ---------------- */
  function myReferralLink() {
    // A simple referral id stored per device; shareable link adds ?ref=ID
    let id = localStorage.getItem("sf_ref_" + sid);
    if (!id) { id = "R" + Math.random().toString(36).slice(2, 8).toUpperCase(); localStorage.setItem("sf_ref_" + sid, id); }
    const base = cfg.storeUrl || location.origin + location.pathname;
    return base + (base.includes("?") ? "&" : "?") + "ref=" + id;
  }
  function captureReferral() {
    const ref = new URLSearchParams(location.search).get("ref");
    if (ref) localStorage.setItem("sf_referred_by_" + sid, ref);
  }
  function showReferral() {
    if (!cfg.referral || !cfg.referral.enabled) { toast("Referral program not enabled"); return; }
    const link = myReferralLink();
    const body = $("#genericModalBody"); if (!body) return;
    body.innerHTML = `<h2>🎁 Refer & Earn</h2>
      <p>${esc(cfg.referral.rewardText || "Share your link and earn rewards!")}</p>
      <div class="giftcard-box"><input id="refLink" value="${esc(link)}" readonly>
        <button class="btn btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('refLink').value);StoreForgeV5._t('🔗 Copied')">Copy</button></div>
      <a class="btn btn-outline btn-block" target="_blank"
         href="https://wa.me/?text=${encodeURIComponent('Check out ' + (cfg.storeName||'this store') + '! ' + link)}">📤 Share on WhatsApp</a>`;
    $("#genericOverlay").classList.add("open"); $("#genericModal").classList.add("open");
  }

  /* ---------------- ADVANCED FILTER (rating + in-stock) ---------------- */
  function bindAdvancedFilter() {
    const inStock = $("#filterInStock");
    if (inStock) inStock.onchange = () => {
      const only = inStock.checked;
      const products = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts() : [];
      document.querySelectorAll("#productGrid .product-card").forEach(card => {
        const nameEl = card.querySelector(".pc-name"); if (!nameEl) return;
        const p = products.find(x => x.name === nameEl.textContent);
        card.style.display = (!only || (p && p.stock)) ? "" : "none";
      });
    };
  }

  /* ---------------- CHECKOUT HOOK: subtract gift card ---------------- */
  function injectGiftCardUI() {
    // Insert a gift-card field into the checkout (below coupon) if cards exist
    if (!getCards().length) return;
    const totals = $("#checkoutTotals");
    if (!totals || $("#giftInput")) return;
    const box = document.createElement("div");
    box.className = "giftcard-box";
    box.innerHTML = `<input id="giftInput" placeholder="Gift card code (optional)">
      <button type="button" class="btn btn-outline" onclick="StoreForgeV5.applyGift()">Apply</button>`;
    totals.parentNode.insertBefore(box, totals);
    const msg = document.createElement("div"); msg.id = "giftMsg"; msg.className = "coupon-msg";
    totals.parentNode.insertBefore(msg, totals);
  }
  function applyGift() {
    const code = ($("#giftInput") || {}).value || "";
    const res = applyGiftCard(code);
    const m = $("#giftMsg"); if (m) { m.textContent = res.msg; m.style.color = res.ok ? "#0f9d58" : "#b3261e"; }
    if (window.StoreForge && StoreForge.refreshTotals) StoreForge.refreshTotals();
  }

  function init() {
    captureReferral();
    bindAdvancedFilter();
    const rb = $("#referralBtn"); if (rb) { rb.hidden = !(cfg.referral && cfg.referral.enabled); rb.onclick = showReferral; }
    // when checkout opens, inject gift-card UI shortly after
    document.addEventListener("click", (e) => {
      if (e.target && (e.target.id === "checkoutBtn")) setTimeout(injectGiftCardUI, 150);
    });
  }

  return { init, applyGiftCard, giftValue, showReferral, applyGift, myReferralLink, _t: toast };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { StoreForgeV5.init(); } catch (e) { console.warn(e); } }, 450));

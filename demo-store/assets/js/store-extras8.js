/* ============================================================================
 * HMG StoreForge v9 — Store Extras 8 (store-extras8.js)
 * ----------------------------------------------------------------------------
 * Adds v9 storefront features on top of v1–v8, without modifying earlier files:
 *   • Product Q&A (customers ask; questions sent to seller WhatsApp + stored)
 *   • Abandoned-cart EMAIL recovery (free Formspree) — capture email, email a
 *     reminder/coupon if cart left behind
 *   • Scroll reveal animations (respects reduced-motion)
 *
 * 100% free, no paid APIs. Loaded after store + extras.
 * ==========================================================================*/

const StoreForgeV9 = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t9); t._t9 = setTimeout(() => t.classList.remove("show"), 2400); };

  /* ---------------- PRODUCT Q&A ---------------- */
  const QKEY = "sf_qa_" + sid;
  const QA = {
    all: () => lsGet(QKEY, {}),
    for: (id) => (QA.all()[id] || []),
    add(id, name, q) { const all = QA.all(); all[id] = all[id] || []; all[id].unshift({ name: name || "Customer", q, date: new Date().toISOString() }); lsSet(QKEY, all); }
  };

  // Injected into the product modal by a hook in store.js
  function qaBlock(product) {
    if (!(cfg.features && cfg.features.qa !== false)) {} // default on unless explicitly off
    if (cfg.features && cfg.features.qa === false) return "";
    const qs = QA.for(product.id);
    return `<div class="qa-block">
      <h3>❓ Questions &amp; Answers</h3>
      <div class="qa-list">${qs.length ? qs.map(x => `
        <div class="qa-item"><strong>${esc(x.name)}</strong> <small>${new Date(x.date).toLocaleDateString()}</small>
        <p>Q: ${esc(x.q)}</p></div>`).join("") : `<p class="muted">No questions yet. Ask the first one!</p>`}</div>
      <div class="qa-form">
        <input id="qaName" placeholder="Your name">
        <textarea id="qaText" rows="2" placeholder="Ask about size, colour, delivery..."></textarea>
        <button class="btn btn-primary" onclick="StoreForgeV9.askQuestion('${product.id}','${esc(product.name)}')">Ask question</button>
      </div></div>`;
  }
  function askQuestion(id, pname) {
    const name = ($("#qaName") || {}).value || "", q = ($("#qaText") || {}).value || "";
    if (!q.trim()) { toast("Please type your question"); return; }
    QA.add(id, name, q);
    // Send to seller WhatsApp so they can answer
    const msg = `❓ Product question on ${cfg.storeName}\nProduct: ${pname}\nFrom: ${name || "Customer"}\nQ: ${q}`;
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    toast("✅ Question sent! We'll reply on WhatsApp.");
    if (window.StoreForge) StoreForge.openProduct(id); // re-render modal with the new question
  }

  /* ---------------- ABANDONED-CART EMAIL RECOVERY ---------------- */
  // Politely capture an email when there are cart items, then (optionally) send a
  // reminder via Formspree if the cart is later abandoned. Free.
  function maybeAskEmail() {
    if (!(cfg.recovery && cfg.recovery.enabled)) return;
    if (lsGet("sf_recovery_email_" + sid, "")) return;            // already have it
    if (lsGet("sf_recovery_dismissed_" + sid, false)) return;     // user dismissed
    const cart = lsGet("sf_cart_" + sid, []);
    if (!cart.length) return;
    const bar = $("#recoveryBar"); if (!bar) return;
    bar.hidden = false;
    bar.innerHTML = `💌 Get ${cfg.recovery.couponHint || "a discount"} + cart reminders — leave your email:
      <input id="recEmail" type="email" placeholder="you@email.com">
      <button class="btn btn-primary" onclick="StoreForgeV9.saveRecoveryEmail()">Save</button>
      <button class="rec-close" onclick="StoreForgeV9.dismissRecovery()">✕</button>`;
  }
  function saveRecoveryEmail() {
    const email = ($("#recEmail") || {}).value || "";
    if (!/.+@.+\..+/.test(email)) { toast("Enter a valid email"); return; }
    lsSet("sf_recovery_email_" + sid, email);
    lsSet("sf_recovery_time_" + sid, Date.now());
    const bar = $("#recoveryBar"); if (bar) bar.hidden = true;
    toast("✅ Saved! Check your email for offers.");
  }
  function dismissRecovery() { lsSet("sf_recovery_dismissed_" + sid, true); const b = $("#recoveryBar"); if (b) b.hidden = true; }

  function checkAbandoned() {
    if (!(cfg.recovery && cfg.recovery.enabled && cfg.recovery.formspreeId)) return;
    const email = lsGet("sf_recovery_email_" + sid, "");
    const t = lsGet("sf_recovery_time_" + sid, 0);
    const sent = lsGet("sf_recovery_sent_" + sid, false);
    const cart = lsGet("sf_cart_" + sid, []);
    if (email && cart.length && t && !sent && Date.now() - t > (cfg.recovery.delayMinutes || 60) * 60000) {
      // Send a recovery email via Formspree (the seller receives it; for true
      // customer emails use Formspree autoresponse template — see RECOVERY doc).
      fetch("https://formspree.io/f/" + cfg.recovery.formspreeId, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "Abandoned cart recovery — " + cfg.storeName,
          email, store: cfg.storeName,
          cart: cart.map(c => `${c.name} x${c.qty}`).join(", "),
          coupon: cfg.recovery.coupon || "",
          link: cfg.storeUrl || location.href
        })
      }).then(() => lsSet("sf_recovery_sent_" + sid, true)).catch(() => {});
    }
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function initReveal() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    $$("section .section-head, .product-card, .trust-badge, .testimonial").forEach(el => { el.classList.add("reveal"); obs.observe(el); });
  }

  function init() {
    initReveal();
    setTimeout(maybeAskEmail, 8000);
    setInterval(checkAbandoned, 30000);
    // re-offer email when cart changes
    window.addEventListener("storage", maybeAskEmail);
  }

  return { init, qaBlock, askQuestion, saveRecoveryEmail, dismissRecovery, QA };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { StoreForgeV9.init(); } catch (e) { console.warn(e); } }, 700));

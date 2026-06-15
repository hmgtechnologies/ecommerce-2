/* ============================================================================
 * HMG StoreForge v8 — Store Extras 7 (store-extras7.js)
 * ----------------------------------------------------------------------------
 * Adds v8 ENTERPRISE features on top of v1–v7, without modifying earlier files:
 *   • Offline-first order queue (place orders with NO internet; auto-send later)
 *   • Online/offline status indicator
 *   • Vendor split-payout helpers (used by ledger.html)
 *
 * 100% free, no paid APIs. Loaded after store + extras.
 * ==========================================================================*/

const StoreForgeV8 = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t8); t._t8 = setTimeout(() => t.classList.remove("show"), 2600); };

  const QKEY = "sf_orderqueue_" + sid;

  /* ---------------- OFFLINE ORDER QUEUE ---------------- */
  const Queue = {
    list: () => lsGet(QKEY, []),
    add(order) { const q = Queue.list(); q.push({ ...order, queuedAt: Date.now() }); lsSet(QKEY, q); renderBar(); },
    clear() { lsSet(QKEY, []); renderBar(); },
    remove(id) { lsSet(QKEY, Queue.list().filter(o => o.id !== id)); renderBar(); }
  };

  function isOnline() { return navigator.onLine; }

  // Build the WhatsApp message for a queued order (same shape store.js uses)
  function waMessage(o) {
    const items = (o.items || []).map(i => `• ${i.name} × ${i.qty} = ${fmt(i.price * i.qty)}`).join("\n");
    return `🧾 ORDER ${o.id} (sent after reconnecting)\nStore: ${cfg.storeName}\n\n${items}\n` +
      `TOTAL: ${fmt(o.total)}\n\n👤 ${o.customer}\n📞 ${o.phone}\n📍 ${o.address}\n💰 ${o.method}`;
  }

  async function flush(manual) {
    const q = Queue.list();
    if (!q.length) { if (manual) toast("No queued orders"); return; }
    if (!isOnline()) { if (manual) toast("Still offline — will retry when connected"); return; }
    // Log each to Google Sheets (v4) if configured, then open WhatsApp for the first/each.
    for (const o of q) {
      if (window.StoreForgeV4 && cfg.orders && cfg.orders.sheetsWebAppUrl) {
        try { await window.StoreForgeV4.logOrderToSheets(o); } catch (e) {}
      }
    }
    // Open WhatsApp messages (stagger to avoid popup blocking)
    q.forEach((o, i) => setTimeout(() => window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(waMessage(o))}`, "_blank"), i * 500));
    toast(`✅ Sent ${q.length} queued order${q.length > 1 ? "s" : ""}`);
    Queue.clear();
  }

  function renderBar() {
    const bar = $("#offlineBar"); if (!bar) return;
    const n = Queue.list().length;
    if (!isOnline()) {
      bar.hidden = false; bar.className = "offline-bar off";
      bar.innerHTML = `📴 You're offline — you can still browse and place orders. ${n ? `(${n} order${n > 1 ? "s" : ""} queued)` : ""}`;
    } else if (n) {
      bar.hidden = false; bar.className = "offline-bar pending";
      bar.innerHTML = `🔄 ${n} queued order${n > 1 ? "s" : ""} ready to send. <button class="btn btn-primary" onclick="StoreForgeV8.flush(true)">Send now</button>`;
    } else { bar.hidden = true; }
  }

  /* ---------------- VENDOR SPLIT-PAYOUT HELPERS (for ledger.html) ---------------- */
  // Build a payout instruction message for a vendor (bank/transfer or Paystack note).
  function payoutMessage(vendor, amount) {
    return `💸 PAYOUT from ${cfg.storeName}\nVendor: ${vendor.name}\nAmount due: ${fmt(amount)}\n` +
      (vendor.bank ? `Bank: ${vendor.bank}\nAccount: ${vendor.accountNumber || ""}\nName: ${vendor.accountName || vendor.name}\n` : "") +
      `\nWe will transfer this to you. Please confirm your details.`;
  }
  function payoutWhatsApp(vendor, amount) {
    const wa = (vendor.whatsapp || cfg.whatsapp || "").replace(/\D/g, "");
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(payoutMessage(vendor, amount))}`, "_blank");
  }

  /* ---------------- INIT ---------------- */
  function init() {
    renderBar();
    window.addEventListener("online", () => { renderBar(); setTimeout(() => flush(false), 800); });
    window.addEventListener("offline", renderBar);
    // Intercept orders: if offline at order time, queue instead of relying on WhatsApp opening.
    window.addEventListener("sf:order", (e) => {
      const o = e.detail || {};
      if (!isOnline()) { Queue.add(o); toast("📴 Offline — order queued, will send when you reconnect"); }
    });
    setInterval(renderBar, 15000);
  }

  return { init, flush, Queue, payoutMessage, payoutWhatsApp, isOnline };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { StoreForgeV8.init(); } catch (e) { console.warn(e); } }, 650));

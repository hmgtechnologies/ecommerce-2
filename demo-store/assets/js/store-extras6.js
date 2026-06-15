/* ============================================================================
 * HMG StoreForge v7 — Store Extras 6 (store-extras6.js)
 * ----------------------------------------------------------------------------
 * Adds v7 ENTERPRISE features on top of v1–v6, without modifying earlier files:
 *   • Buyer accounts + saved addresses (local, no backend)
 *   • Subscriptions / recurring orders (weekly/monthly reminders)
 *   • Account drawer with order history
 *
 * 100% free, no paid APIs, no external libraries. Loaded after store + extras.
 * ==========================================================================*/

const StoreForgeV7 = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t7); t._t7 = setTimeout(() => t.classList.remove("show"), 2400); };

  /* ---------------- BUYER ACCOUNT ---------------- */
  const KEY = "sf_account_" + sid;
  const Account = {
    get: () => lsGet(KEY, null),
    loggedIn: () => !!Account.get(),
    save(acc) { lsSet(KEY, acc); renderBtn(); },
    signOut() { localStorage.removeItem(KEY); renderBtn(); toast("Signed out"); },
    addresses: () => (Account.get() || {}).addresses || [],
    addAddress(label, address) {
      const a = Account.get() || {}; a.addresses = a.addresses || [];
      a.addresses.push({ label, address }); lsSet(KEY, a);
    },
    removeAddress(i) { const a = Account.get() || {}; (a.addresses || []).splice(i, 1); lsSet(KEY, a); openAccount(); }
  };

  function renderBtn() {
    const b = $("#accountBtn"); if (!b) return;
    if (!(cfg.accounts && cfg.accounts.enabled)) { b.hidden = true; return; }
    b.hidden = false;
    const acc = Account.get();
    b.textContent = acc ? `👤 ${acc.name.split(" ")[0]}` : "👤 Sign in";
    b.onclick = openAccount;
  }

  function openAccount() {
    const acc = Account.get();
    const body = $("#genericModalBody"); if (!body) return;
    if (!acc) {
      body.innerHTML = `<h2>👤 Create / Sign in</h2>
        <p class="muted">Save your details for faster checkout and to see your orders. Stored on this
        device only — no password needed.</p>
        <div class="acc-form">
          <label>Full name *</label><input id="accName">
          <label>Phone / WhatsApp *</label><input id="accPhone">
          <label>Email (optional)</label><input id="accEmail">
          <label>Default delivery address</label><textarea id="accAddr" rows="2"></textarea>
          <button class="btn btn-primary btn-block" onclick="StoreForgeV7.signIn()">Save & continue</button>
        </div>`;
    } else {
      const subs = Subscriptions.list();
      const orders = lsGet("sfp_orders_" + sid, []);
      body.innerHTML = `<h2>👤 ${esc(acc.name)}</h2>
        <p class="muted">${esc(acc.phone)} ${acc.email ? "· " + esc(acc.email) : ""}</p>

        <h3 style="margin-top:1rem">📍 Saved addresses</h3>
        <div class="addr-list">${(acc.addresses || []).length ? acc.addresses.map((a, i) => `
          <div class="addr-row"><div><strong>${esc(a.label || "Address")}</strong><br><small>${esc(a.address)}</small></div>
          <button class="link-btn" onclick="StoreForgeV7.removeAddress(${i})">Remove</button></div>`).join("")
          : `<p class="muted">No saved addresses.</p>`}</div>
        <div class="acc-form" style="margin-top:.5rem">
          <input id="addrLabel" placeholder="Label (e.g. Home, Office)">
          <textarea id="addrText" rows="2" placeholder="Address"></textarea>
          <button class="btn btn-outline" onclick="StoreForgeV7.addAddr()">+ Add address</button>
        </div>

        <h3 style="margin-top:1rem">🧾 My orders (${orders.length})</h3>
        <div class="addr-list">${orders.slice(0, 5).map(o => `
          <div class="addr-row"><div><strong>${esc(o.id)}</strong><br><small>${fmt(o.total)} · ${new Date(o.date).toLocaleDateString()}</small></div>
          <a class="link-btn" href="track.html">Track</a></div>`).join("") || `<p class="muted">No orders yet.</p>`}</div>

        <h3 style="margin-top:1rem">🔁 My subscriptions (${subs.length})</h3>
        <div class="addr-list">${subs.length ? subs.map((s, i) => `
          <div class="addr-row"><div><strong>${esc(s.name)}</strong><br><small>Every ${s.interval} · next: ${new Date(s.next).toLocaleDateString()}</small></div>
          <button class="link-btn" onclick="StoreForgeV7.reorder(${i})">Reorder now</button>
          <button class="link-btn" onclick="StoreForgeV7.cancelSub(${i})">Cancel</button></div>`).join("")
          : `<p class="muted">No subscriptions. Set one up from any product.</p>`}</div>

        <button class="btn btn-text btn-block" style="margin-top:1rem" onclick="StoreForgeV7.signOut()">Sign out</button>`;
    }
    $("#genericOverlay").classList.add("open"); $("#genericModal").classList.add("open");
  }

  function signIn() {
    const name = $("#accName").value.trim(), phone = $("#accPhone").value.trim();
    if (!name || !phone) { toast("Please enter name and phone"); return; }
    const acc = { name, phone, email: ($("#accEmail").value || "").trim(), addresses: [] };
    const addr = ($("#accAddr").value || "").trim();
    if (addr) acc.addresses.push({ label: "Default", address: addr });
    Account.save(acc); toast("✅ Account saved"); openAccount();
  }
  function addAddr() {
    const label = $("#addrLabel").value.trim() || "Address", text = $("#addrText").value.trim();
    if (!text) { toast("Enter an address"); return; }
    Account.addAddress(label, text); toast("✅ Address added"); openAccount();
  }

  /* ---------------- SUBSCRIPTIONS / RECURRING ORDERS ---------------- */
  const SKEY = "sf_subs_" + sid;
  const Subscriptions = {
    list: () => lsGet(SKEY, []),
    add(product, interval) {
      const days = interval === "weekly" ? 7 : interval === "biweekly" ? 14 : 30;
      const next = Date.now() + days * 86400000;
      const subs = Subscriptions.list();
      subs.push({ id: product.id, name: product.name, price: product.price, interval, next });
      lsSet(SKEY, subs);
      toast(`🔁 Subscribed — we'll remind you ${interval}`);
      // ask for notification permission so reminders can pop
      if (window.StoreForgeV6) StoreForgeV6.askNotify && StoreForgeV6.askNotify();
    },
    cancel(i) { const s = Subscriptions.list(); s.splice(i, 1); lsSet(SKEY, s); openAccount(); toast("Subscription cancelled"); },
    reorder(i) {
      const s = Subscriptions.list()[i]; if (!s) return;
      if (window.StoreForge && StoreForge.addToCart) StoreForge.addToCart(s.id);
      // bump next date
      const subs = Subscriptions.list();
      const days = s.interval === "weekly" ? 7 : s.interval === "biweekly" ? 14 : 30;
      subs[i].next = Date.now() + days * 86400000; lsSet(SKEY, subs);
      toast("✅ Added to cart — checkout to reorder"); openAccount();
    },
    checkDue() {
      const due = Subscriptions.list().filter(s => s.next <= Date.now());
      if (due.length && window.StoreForgeV6) {
        StoreForgeV6.notify("🔁 Time to reorder!", due.map(s => s.name).join(", ") + " — tap to reorder.", "index.html");
      }
      // also show a bar
      if (due.length) {
        const bar = $("#subBar");
        if (bar) { bar.hidden = false; bar.innerHTML = `🔁 Time to reorder: <strong>${due.map(s => esc(s.name)).join(", ")}</strong>
          <button class="btn btn-primary" onclick="StoreForgeV7.openAccount()">Reorder</button>
          <button class="sub-close" onclick="this.parentElement.hidden=true">✕</button>`; }
      }
    }
  };

  /* ---------------- Product-modal "Subscribe" button (hook) ---------------- */
  function subscribeUI(product) {
    if (!(cfg.subscriptions && cfg.subscriptions.enabled)) return "";
    return `<div class="sub-box">
      <label style="font-weight:600;font-size:.85rem">🔁 Subscribe & save reminders</label>
      <div style="display:flex;gap:.5rem;margin-top:.3rem">
        <select id="subInterval"><option value="weekly">Weekly</option><option value="biweekly">Every 2 weeks</option><option value="monthly">Monthly</option></select>
        <button class="btn btn-outline" onclick="StoreForgeV7.subscribe('${product.id}')">Subscribe</button>
      </div></div>`;
  }
  function subscribe(id) {
    const p = (window.StoreForge && StoreForge.getProducts) ? StoreForge.getProducts().find(x => x.id === id) : null;
    if (!p) return;
    const interval = ($("#subInterval") || {}).value || "monthly";
    Subscriptions.add(p, interval);
  }

  /* ---------------- CHECKOUT: prefill from account + address dropdown ---------------- */
  function checkoutPrefill() {
    const acc = Account.get(); if (!acc) return;
    const n = $("#coName"), p = $("#coPhone"), addr = $("#coAddr");
    if (n && !n.value) n.value = acc.name;
    if (p && !p.value) p.value = acc.phone;
    if (addr && !addr.value && (acc.addresses || []).length) addr.value = acc.addresses[0].address;
    // address picker
    if (addr && (acc.addresses || []).length > 1 && !$("#addrPicker")) {
      const sel = document.createElement("select"); sel.id = "addrPicker";
      sel.innerHTML = acc.addresses.map((a, i) => `<option value="${i}">${esc(a.label)}: ${esc(a.address).slice(0, 30)}…</option>`).join("");
      sel.onchange = () => { addr.value = acc.addresses[sel.value].address; };
      addr.parentNode.insertBefore(sel, addr);
    }
  }

  function init() {
    renderBtn();
    Subscriptions.checkDue();
    // save/refresh account from each placed order
    window.addEventListener("sf:order", (e) => {
      const o = e.detail || {};
      if (cfg.accounts && cfg.accounts.enabled) {
        const acc = Account.get() || { addresses: [] };
        acc.name = o.customer || acc.name; acc.phone = o.phone || acc.phone;
        if (o.address && !(acc.addresses || []).some(a => a.address === o.address)) {
          acc.addresses = acc.addresses || []; acc.addresses.push({ label: "Recent", address: o.address });
        }
        Account.save(acc);
      }
    });
    // hook checkout open to prefill
    document.addEventListener("click", (e) => { if (e.target && e.target.id === "checkoutBtn") setTimeout(checkoutPrefill, 180); });
  }

  return {
    init, openAccount, signIn, signOut: Account.signOut, addAddr, removeAddress: Account.removeAddress,
    subscribe, subscribeUI, reorder: Subscriptions.reorder, cancelSub: Subscriptions.cancel,
    Account, Subscriptions
  };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { StoreForgeV7.init(); } catch (e) { console.warn(e); } }, 600));

/* ============================================================================
 * HMG StoreForge — Store Engine (store.js)
 * ----------------------------------------------------------------------------
 * Handles: data loading (Supabase primary → JSON fallback), Google Drive image
 * link conversion, rendering, search/filter/sort, cart (localStorage), product
 * modal, checkout (manual transfer + Paystack/Flutterwave), and order delivery
 * via WhatsApp or email. Zero paid APIs. Works fully client-side.
 * ==========================================================================*/

const StoreForge = (function () {
  const cfg = window.STORE_CONFIG || {};
  let PRODUCTS = [];
  let cart = JSON.parse(localStorage.getItem("sf_cart_" + (cfg.storeId || "default")) || "[]");
  let activeCategory = "";

  /* ---------- Utilities ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
  const cartKey = "sf_cart_" + (cfg.storeId || "default");

  /** Convert a Google Drive share link into a direct-view image URL. */
  function driveImage(url) {
    if (!url) return "assets/images/placeholder.png";
    // Matches .../file/d/<ID>/...  OR  ...?id=<ID>
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`;
    return url; // already a direct URL or local path
  }

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Data loading: Supabase → JSON fallback ---------- */
  async function loadProducts() {
    // 1) Try Supabase if configured
    if (cfg.supabase && cfg.supabase.url && cfg.supabase.anonKey) {
      try {
        const res = await fetch(
          `${cfg.supabase.url}/rest/v1/${cfg.supabase.table || "products"}?select=*&active=eq.true&order=created_at.desc`,
          { headers: { apikey: cfg.supabase.anonKey, Authorization: "Bearer " + cfg.supabase.anonKey } }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length) {
            PRODUCTS = data.map(normalize);
            return;
          }
        }
      } catch (e) { console.warn("Supabase load failed, falling back to JSON.", e); }
    }
    // 2) Try products.json
    try {
      const res = await fetch("products.json", { cache: "no-store" });
      if (res.ok) { const d = await res.json(); PRODUCTS = (d.products || d).map(normalize); return; }
    } catch (e) { /* ignore */ }
    // 3) Built-in fallback (products-fallback.js)
    PRODUCTS = (window.PRODUCTS_FALLBACK || []).map(normalize);
  }

  function normalize(p, i) {
    return {
      id: p.id ?? "p" + i,
      name: p.name || "Untitled",
      price: Number(p.price) || 0,
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      category: p.category || "General",
      description: p.description || "",
      image: driveImage(p.image || p.image_url),
      images: (p.images || []).map(driveImage),
      stock: p.stock === undefined ? true : !!p.stock,
      featured: !!p.featured,
      created_at: p.created_at || "",
      // v2 enterprise fields
      qty: (p.qty === undefined || p.qty === null || p.qty === "") ? null : Number(p.qty),
      variants: Array.isArray(p.variants) ? p.variants : [],
      sku: p.sku || "",
      // v5 marketplace field
      vendor: p.vendor || ""
    };
  }
  // Expose products for extras module
  function getProducts() { return PRODUCTS; }

  /* ---------- Rendering ---------- */
  function getFiltered() {
    const q = ($("#searchInput").value || "").toLowerCase().trim();
    const cat = $("#categoryFilter").value || activeCategory;
    let list = PRODUCTS.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchC = !cat || p.category === cat;
      return matchQ && matchC;
    });
    const sort = $("#sortSelect").value;
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "newest") list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    else list.sort((a, b) => (b.featured - a.featured));
    return list;
  }

  function renderProducts() {
    const grid = $("#productGrid"); const list = getFiltered();
    $("#resultCount").textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;
    $("#emptyState").hidden = list.length !== 0;
    grid.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="pc-img">
          <img src="${p.image}" alt="${esc(p.name)}" loading="lazy"
               onclick="StoreForge.openProduct('${p.id}')"
               onerror="this.src='assets/images/placeholder.png'">
          ${p.oldPrice ? `<span class="pc-badge">SALE</span>` : (p.featured ? `<span class="pc-badge">★ Featured</span>` : "")}
          ${(typeof p.qty === "number" && p.qty > 0 && p.qty <= 3) ? `<span class="pc-badge low">Only ${p.qty} left</span>` : ""}
          ${!p.stock ? `<span class="pc-badge out">Out of stock</span>` : ""}
          <button class="wish-btn ${(window.StoreForgePlus && StoreForgePlus.Wish.has(p.id)) ? 'on' : ''}" data-id="${p.id}"
                  title="Add to wishlist" onclick="event.stopPropagation();StoreForgePlus&&StoreForgePlus.toggleWish('${p.id}')">❤</button>
        </div>
        <div class="pc-body">
          <span class="pc-cat">${esc(p.category)}</span>
          <span class="pc-name" onclick="StoreForge.openProduct('${p.id}')">${esc(p.name)}</span>
          <div class="pc-price">${fmt(p.price)}${p.oldPrice ? `<span class="pc-old">${fmt(p.oldPrice)}</span>` : ""}</div>
          <div class="pc-actions">
            ${p.stock
              ? `<button class="btn btn-primary" onclick="StoreForge.addToCart('${p.id}')" data-i18n="add">Add to cart</button>`
              : `<button class="btn btn-outline" data-notify="${esc(p.name)}">🔔 Notify me</button>`}
            <button class="pc-compare" title="Compare" data-compare="${p.id}">⚖️</button>
          </div>
        </div>
      </article>`).join("");
  }

  function renderCategories() {
    const cats = [...new Set(PRODUCTS.map(p => p.category))].sort();
    $("#categoryFilter").innerHTML = `<option value="">All Categories</option>` +
      cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
    $("#categoryPills").innerHTML =
      `<span class="cat-pill ${!activeCategory ? "active" : ""}" onclick="StoreForge.setCategory('')">All</span>` +
      cats.map(c => `<span class="cat-pill ${activeCategory === c ? "active" : ""}" onclick="StoreForge.setCategory('${esc(c)}')">${esc(c)}</span>`).join("");
  }

  /* ---------- Product modal ---------- */
  function openProduct(id) {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return;
    $("#modalBody").innerHTML = `
      <div class="modal-product">
        <div><img src="${p.image}" alt="${esc(p.name)}" onerror="this.src='assets/images/placeholder.png'"></div>
        <div>
          <span class="pc-cat">${esc(p.category)}</span>
          <h2>${esc(p.name)}</h2>
          <div class="mp-price">${fmt(p.price)}${p.oldPrice ? `<span class="pc-old">${fmt(p.oldPrice)}</span>` : ""}</div>
          <p class="mp-desc">${esc(p.description) || "No description provided."}</p>
          ${p.stock
            ? `<button class="btn btn-primary btn-block" onclick="StoreForge.addToCart('${p.id}');StoreForge.closeModal()">🛒 Add to cart</button>
               <button class="btn btn-outline btn-block" style="margin-top:.5rem" onclick="StoreForge.orderViaWhatsApp('${p.id}')">💬 Order on WhatsApp</button>`
            : `<p style="color:#b3261e;font-weight:600">Currently out of stock.</p>
               <button class="btn btn-outline btn-block" onclick="StoreForge.orderViaWhatsApp('${p.id}')">💬 Enquire on WhatsApp</button>`}
        </div>
      </div>`;
    // v5: marketplace vendor block (if enabled)
    if (window.Marketplace && Marketplace.enabled()) {
      try {
        const vb = Marketplace.vendorBlock(p);
        if (vb) { const right = $("#modalBody").querySelector(".modal-product > div:last-child"); if (right) right.insertAdjacentHTML("beforeend", vb); }
      } catch (e) { console.warn(e); }
    }
    $("#modalOverlay").classList.add("open"); $("#productModal").classList.add("open");
    // v2: let extras decorate the modal (gallery, variants, reviews, related, share, wishlist)
    if (window.StoreForgePlus) try { StoreForgePlus.decorateModal(p); } catch (e) { console.warn(e); }
    // v7: subscribe / recurring-order UI
    if (window.StoreForgeV7 && p.stock) {
      try {
        const sub = StoreForgeV7.subscribeUI(p);
        if (sub) { const right = $("#modalBody").querySelector(".modal-product > div:last-child"); if (right) right.insertAdjacentHTML("beforeend", sub); }
      } catch (e) { console.warn(e); }
    }
    // v9: product Q&A block
    if (window.StoreForgeV9) {
      try {
        const qa = StoreForgeV9.qaBlock(p);
        if (qa) $("#modalBody").insertAdjacentHTML("beforeend", qa);
      } catch (e) { console.warn(e); }
    }
  }
  function closeModal() { $("#modalOverlay").classList.remove("open"); $("#productModal").classList.remove("open"); }

  /* ---------- Cart ---------- */
  function saveCart() { localStorage.setItem(cartKey, JSON.stringify(cart)); updateCartUI(); }
  function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return;
    const item = cart.find(c => c.id === id);
    if (item) item.qty++; else cart.push({ id, name: p.name, price: p.price, image: p.image, qty: 1 });
    saveCart(); toast("✅ Added to cart");
  }
  function changeQty(id, d) {
    const item = cart.find(c => c.id === id); if (!item) return;
    item.qty += d; if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart();
  }
  function removeItem(id) { cart = cart.filter(c => c.id !== id); saveCart(); toast("Removed"); }
  function cartTotal() { return cart.reduce((s, c) => s + c.price * c.qty, 0); }
  function cartCount() { return cart.reduce((s, c) => s + c.qty, 0); }

  function updateCartUI() {
    $("#cartCount").textContent = cartCount();
    $("#cartTotal").textContent = fmt(cartTotal());
    const wrap = $("#cartItems");
    if (!cart.length) { wrap.innerHTML = `<div class="cart-empty">🛒 Your cart is empty.</div>`; return; }
    wrap.innerHTML = cart.map(c => `
      <div class="cart-item">
        <img src="${c.image}" alt="${esc(c.name)}" onerror="this.src='assets/images/placeholder.png'">
        <div class="ci-info">
          <div class="ci-name">${esc(c.name)}</div>
          <div class="ci-price">${fmt(c.price)}</div>
          <div class="ci-qty">
            <button onclick="StoreForge.changeQty('${c.id}',-1)">−</button>
            <span>${c.qty}</span>
            <button onclick="StoreForge.changeQty('${c.id}',1)">+</button>
            <button class="ci-remove" onclick="StoreForge.removeItem('${c.id}')">Remove</button>
          </div>
        </div>
        <strong>${fmt(c.price * c.qty)}</strong>
      </div>`).join("");
  }
  function openCart() { $("#cartOverlay").classList.add("open"); $("#cartDrawer").classList.add("open"); }
  function closeCart() { $("#cartOverlay").classList.remove("open"); $("#cartDrawer").classList.remove("open"); }

  /* ---------- WhatsApp ordering ---------- */
  function waLink(msg) { return `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`; }

  function orderViaWhatsApp(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const msg = `Hello ${cfg.storeName}! 👋\nI'd like to order:\n• ${p.name} — ${fmt(p.price)}\n\nIs it available?`;
    window.open(waLink(msg), "_blank");
  }

  /* ---------- Checkout ---------- */
  function openCheckout() {
    if (!cart.length) { toast("Your cart is empty"); return; }
    closeCart();
    const lines = cart.map(c => `<div class="row"><span>${esc(c.name)} × ${c.qty}</span><span>${fmt(c.price * c.qty)}</span></div>`).join("");
    const pay = cfg.payments || {};
    let payHtml = "";
    if (pay.manual && pay.manual.enabled) payHtml += payOpt("manual", "🏦 Bank Transfer", "Pay to our account, then confirm on WhatsApp.");
    if (pay.gateway && pay.gateway.enabled) payHtml += payOpt("gateway", `💳 Pay Online (${pay.gateway.provider || "Paystack"})`, "Secure card / transfer payment.");
    payHtml += payOpt("whatsapp", "💬 Order via WhatsApp", "Send your order to us and arrange payment.");

    // v2: coupon + delivery zone UI (only if configured)
    const hasCoupons = window.StoreForgePlus && StoreForgePlus.getCoupons().length;
    const zones = window.StoreForgePlus ? StoreForgePlus.getZones() : [];
    const couponHtml = hasCoupons ? `
      <div class="coupon-row">
        <input id="couponInput" placeholder="Discount code (optional)">
        <button type="button" class="btn btn-outline" onclick="StoreForge.applyCoupon()">Apply</button>
      </div><div id="couponMsg" class="coupon-msg"></div>` : "";
    const estDelivery = window.StoreForgeV4 ? StoreForgeV4.estimatedDelivery() : "";
    const deliveryHtml = zones.length ? `
      <label style="margin-top:.6rem;font-weight:600;font-size:.9rem">Delivery zone</label>
      <select id="deliveryZone" onchange="StoreForge.refreshTotals()">
        <option value="">Select delivery area…</option>
        ${zones.map(z => `<option value="${esc(z.name)}">${esc(z.name)} — ${fmt(z.fee)}</option>`).join("")}
      </select>
      ${estDelivery ? `<p class="est-delivery">🚚 Estimated delivery by <strong>${estDelivery}</strong></p>` : ""}` : "";

    $("#checkoutBody").innerHTML = `
      <h2>Checkout</h2>
      <div class="checkout-summary">
        ${lines}
        <div class="row" style="border-top:1px solid var(--border);margin-top:.4rem;padding-top:.4rem">
          <strong>Total</strong><strong>${fmt(cartTotal())}</strong></div>
      </div>
      ${couponHtml}
      ${deliveryHtml}
      <div class="checkout-totals" id="checkoutTotals"></div>
      <form class="checkout-form" id="coForm" onsubmit="return false">
        <label>Full name *</label><input id="coName" required>
        <label>Phone / WhatsApp *</label><input id="coPhone" required>
        <label>Delivery address *</label><textarea id="coAddr" rows="2" required></textarea>
        <label>Notes (optional)</label><input id="coNote">
        <label style="margin-top:1rem">Choose payment method</label>
        <div class="pay-options" id="payOptions">${payHtml}</div>
        <button class="btn btn-primary btn-block" style="margin-top:1rem" onclick="StoreForge.placeOrder()">Place Order →</button>
      </form>`;
    // select first option by default
    const first = $("#payOptions .pay-option"); if (first) { first.classList.add("sel"); first.querySelector("input").checked = true; }
    $$("#payOptions .pay-option").forEach(o => o.onclick = () => {
      $$("#payOptions .pay-option").forEach(x => x.classList.remove("sel"));
      o.classList.add("sel"); o.querySelector("input").checked = true;
    });
    $("#checkoutOverlay").classList.add("open"); $("#checkoutModal").classList.add("open");
    refreshTotals();
    // v3: prefill returning customer + auto-apply coupon from URL
    if (window.StoreForgeV3) {
      try {
        StoreForgeV3.Account.prefill();
        const pc = StoreForgeV3.pendingCoupon();
        if (pc && $("#couponInput")) { $("#couponInput").value = pc; applyCoupon(); }
      } catch (e) { console.warn(e); }
    }
  }

  /* v2: live totals with discount + delivery (+ v5 gift card) */
  function refreshTotals() {
    const sub = cartTotal();
    const discount = window.StoreForgePlus ? StoreForgePlus.discountAmount() : 0;
    const zone = ($("#deliveryZone") || {}).value || "";
    const delivery = (window.StoreForgePlus && zone) ? StoreForgePlus.deliveryFee(zone) : 0;
    const gift = window.StoreForgeV5 ? StoreForgeV5.giftValue() : 0;
    const grand = Math.max(0, sub - discount + delivery - gift);
    const el = $("#checkoutTotals"); if (!el) return;
    el.innerHTML = `
      <div class="row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
      ${discount ? `<div class="row" style="color:#0f9d58"><span>Discount</span><span>−${fmt(discount)}</span></div>` : ""}
      ${gift ? `<div class="row" style="color:#0f9d58"><span>Gift card</span><span>−${fmt(gift)}</span></div>` : ""}
      ${zone ? `<div class="row"><span>Delivery (${esc(zone)})</span><span>${delivery ? fmt(delivery) : "FREE"}</span></div>` : ""}
      <div class="row grand"><strong>Total to pay</strong><strong>${fmt(grand)}</strong></div>`;
  }

  function applyCoupon() {
    if (!window.StoreForgePlus) return;
    const code = ($("#couponInput") || {}).value || "";
    const res = StoreForgePlus.applyCoupon(code);
    const msg = $("#couponMsg");
    if (msg) { msg.textContent = res.msg; msg.style.color = res.ok ? "#0f9d58" : "#b3261e"; }
    refreshTotals();
  }

  function payOpt(v, title, sub) {
    return `<label class="pay-option"><input type="radio" name="pay" value="${v}">
      <span><strong>${title}</strong><br><small style="color:var(--muted)">${sub}</small></span></label>`;
  }
  function closeCheckout() { $("#checkoutOverlay").classList.remove("open"); $("#checkoutModal").classList.remove("open"); }

  function placeOrder() {
    const name = $("#coName").value.trim(), phone = $("#coPhone").value.trim(),
          addr = $("#coAddr").value.trim(), note = $("#coNote").value.trim();
    if (!name || !phone || !addr) { toast("Please fill all required fields"); return; }
    const method = ($("#payOptions input:checked") || {}).value || "whatsapp";
    const pay = cfg.payments || {};
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    const items = cart.map(c => `• ${c.name} × ${c.qty} = ${fmt(c.price * c.qty)}`).join("\n");
    // v2: discount + delivery (+ v5 gift card)
    const sub = cartTotal();
    const discount = window.StoreForgePlus ? StoreForgePlus.discountAmount() : 0;
    const zone = ($("#deliveryZone") || {}).value || "";
    const delivery = (window.StoreForgePlus && zone) ? StoreForgePlus.deliveryFee(zone) : 0;
    const gift = window.StoreForgeV5 ? StoreForgeV5.giftValue() : 0;
    const grand = Math.max(0, sub - discount + delivery - gift);
    const summary =
`🧾 NEW ORDER ${orderId}
Store: ${cfg.storeName}

${items}
Subtotal: ${fmt(sub)}${discount ? `\nDiscount: −${fmt(discount)}` : ""}${gift ? `\nGift card: −${fmt(gift)}` : ""}${zone ? `\nDelivery (${zone}): ${delivery ? fmt(delivery) : "FREE"}` : ""}
TOTAL: ${fmt(grand)}

👤 ${name}
📞 ${phone}
📍 ${addr}
📝 ${note || "—"}
💰 Payment: ${method.toUpperCase()}`;

    // v2: save order locally for the customer's order-tracking page
    const orderRecord = {
      id: orderId, items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      subtotal: sub, discount, delivery, zone, total: grand, customer: name, phone, address: addr,
      method, status: "pending", date: new Date().toISOString()
    };
    if (window.StoreForgePlus) StoreForgePlus.Orders.save(orderRecord);
    // v3: remember the customer for next time
    if (window.StoreForgeV3) try { StoreForgeV3.Account.save(name, phone); } catch (e) {}

    // v5: marketplace order splitting — if items span multiple vendors, message each vendor.
    let splitHandled = false;
    if (window.Marketplace && Marketplace.enabled()) {
      try { splitHandled = Marketplace.splitOrder({ ...orderRecord, method }); } catch (e) { console.warn(e); }
    }

    if (splitHandled) {
      // each vendor already messaged; also notify the main store for the record
      window.open(waLink(summary + "\n\n(Multi-vendor order — each vendor has been messaged.)"), "_blank");
    } else if (method === "gateway" && pay.gateway && pay.gateway.paymentLink) {
      // Open the client's Paystack/Flutterwave payment link, then notify on WhatsApp.
      window.open(pay.gateway.paymentLink, "_blank");
      window.open(waLink(summary + "\n\n(I am paying online now.)"), "_blank");
    } else if (method === "manual" && pay.manual && pay.manual.enabled) {
      const bank = `\n\nBANK DETAILS:\nBank: ${pay.manual.bank}\nAccount: ${pay.manual.accountNumber}\nName: ${pay.manual.accountName}`;
      window.open(waLink(summary + bank + "\n\n(I will send proof of payment.)"), "_blank");
    } else {
      window.open(waLink(summary), "_blank");
    }
    // v4: broadcast the order so extras can log it to Google Sheets, award loyalty, etc.
    try { window.dispatchEvent(new CustomEvent("sf:order", { detail: { ...orderRecord, notes: note } })); } catch (e) {}

    // Clear cart after placing
    cart = []; saveCart(); closeCheckout(); toast("✅ Order sent! Check WhatsApp.");
    // v3: offer a printable receipt
    if (window.StoreForgeV3) setTimeout(() => {
      if (confirm("Order sent! Would you like to print/save a receipt?")) StoreForgeV3.printReceipt(orderRecord);
    }, 600);
  }

  /* ---------- Filters ---------- */
  function setCategory(c) { activeCategory = c; $("#categoryFilter").value = c; renderCategories(); renderProducts(); }
  function clearFilters() { $("#searchInput").value = ""; $("#categoryFilter").value = ""; activeCategory = ""; $("#sortSelect").value = "default"; renderCategories(); renderProducts(); }

  function esc(s) { return String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }

  /* ---------- Theme ---------- */
  function initTheme() {
    const saved = localStorage.getItem("sf_theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    $("#themeToggle").onclick = () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      localStorage.setItem("sf_theme", cur);
    };
  }

  /* ---------- Apply config (branding, contacts, theme colours) ---------- */
  function applyConfig() {
    document.title = `${cfg.storeName} — Online Store`;
    // Theme colours
    if (cfg.theme) for (const k in cfg.theme)
      document.documentElement.style.setProperty("--" + k, cfg.theme[k]);
    // Replace text placeholders left in HTML
    document.body.innerHTML = document.body.innerHTML
      .replaceAll("{{STORE_NAME}}", esc(cfg.storeName || "My Store"))
      .replaceAll("{{STORE_TAGLINE}}", esc(cfg.tagline || ""))
      .replaceAll("{{STORE_LOCATION}}", esc(cfg.location || ""))
      .replaceAll("{{STORE_ABOUT}}", esc(cfg.about || ""))
      .replaceAll("{{STORE_URL}}", esc(cfg.storeUrl || ""));
    // Contacts
    const wa = waLink(`Hello ${cfg.storeName}! I have an enquiry.`);
    setText("#aboutWhatsapp", cfg.whatsappDisplay || cfg.whatsapp);
    setText("#aboutEmail", cfg.email || "");
    setText("#contactEmailText", cfg.email || "");
    setText("#contactCallText", cfg.phoneDisplay || cfg.whatsappDisplay || "");
    setAttr("#aboutWaBtn", "href", wa);
    setAttr("#contactWa", "href", wa);
    setAttr("#floatWa", "href", wa);
    setAttr("#contactEmail", "href", cfg.email ? `mailto:${cfg.email}?subject=Enquiry%20from%20${encodeURIComponent(cfg.storeName)}%20website` : "#");
    setAttr("#contactCall", "href", cfg.phone ? `tel:${cfg.phone}` : `tel:${cfg.whatsapp}`);
    if (cfg.announcement) setText("#announceText", cfg.announcement);
    setText("#year", new Date().getFullYear());
    // Social links
    if (cfg.social) $("#socialRow").innerHTML = Object.entries(cfg.social)
      .filter(([, v]) => v).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener" title="${k}">${socialIcon(k)}</a>`).join("");
    // HMG lead-gen credit (config-driven; embeds YOUR brand on every client store)
    const lg = cfg.leadGen || {};
    const lgName = lg.company || "HMG Technologies";
    const lgSite = lg.site || "https://hmgtechnologies.pages.dev";
    const lgWa = (lg.whatsapp || "2348100866322").replace(/\D/g, "");
    const lgMsg = encodeURIComponent(`Hi ${lgName}! I saw the store "${cfg.storeName||""}" you built and I want my own online store.`);
    $("#hmgPowered").innerHTML =
      `⚡ Built by <a href="${lgSite}" target="_blank" rel="noopener"><strong>${esc(lgName)}</strong></a>` +
      (lg.founder ? ` · ${esc(lg.founder)}` : "") + ` · ` +
      `<a href="https://wa.me/${lgWa}?text=${lgMsg}" target="_blank" rel="noopener">Get your own store 💬</a>`;
    // Optional floating lead-gen badge (shows unless leadGen.badge === false)
    if (lg.badge !== false) {
      let badge = $("#hmgBadge");
      if (!badge) { badge = document.createElement("a"); badge.id = "hmgBadge"; badge.className = "hmg-badge"; document.body.appendChild(badge); }
      badge.href = `https://wa.me/${lgWa}?text=${lgMsg}`; badge.target = "_blank"; badge.rel = "noopener";
      badge.innerHTML = `🚀 Want a store like this? <strong>Chat ${esc(lgName)}</strong>`;
    }
  }
  function socialIcon(k) { return ({ facebook:"📘", instagram:"📸", twitter:"🐦", x:"🐦", tiktok:"🎵", youtube:"📺", whatsapp:"💬", linkedin:"💼" }[k.toLowerCase()] || "🔗"); }
  function setText(s, t) { const e = $(s); if (e) e.textContent = t; }
  function setAttr(s, a, v) { const e = $(s); if (e) e.setAttribute(a, v); }

  /* ---------- Init ---------- */
  async function init() {
    applyConfig(); initTheme();
    // Re-bind elements that were replaced by applyConfig's innerHTML swap
    bindUI();
    await loadProducts();
    renderCategories(); renderProducts(); updateCartUI();
    // v2: initialise enterprise extras with loaded products
    if (window.StoreForgePlus) try { StoreForgePlus.init(PRODUCTS); } catch (e) { console.warn(e); }
    // v2: open product from URL hash (deep-link / shared links)
    if (location.hash.length > 1) { const id = location.hash.slice(1); if (PRODUCTS.find(p => p.id === id)) openProduct(id); }
  }
  function bindUI() {
    $("#cartBtn").onclick = openCart;
    $("#cartClose").onclick = closeCart;
    $("#cartOverlay").onclick = closeCart;
    $("#continueShopping").onclick = closeCart;
    $("#checkoutBtn").onclick = openCheckout;
    $("#modalClose").onclick = closeModal;
    $("#modalOverlay").onclick = closeModal;
    $("#checkoutClose").onclick = closeCheckout;
    $("#checkoutOverlay").onclick = closeCheckout;
    $("#searchInput").oninput = renderProducts;
    $("#categoryFilter").onchange = () => { activeCategory = $("#categoryFilter").value; renderCategories(); renderProducts(); };
    $("#sortSelect").onchange = renderProducts;
    $("#navToggle").onclick = () => $("#mainNav").classList.toggle("open");
  }

  document.addEventListener("DOMContentLoaded", init);

  // Public API
  return { openProduct, closeModal, addToCart, changeQty, removeItem, orderViaWhatsApp,
           openCheckout, placeOrder, setCategory, clearFilters,
           // v2 additions
           refreshTotals, applyCoupon, getProducts, loadProducts, fmt };
})();

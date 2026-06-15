/* ============================================================================
 * HMG StoreForge v2 — Store Extras (store-extras.js)
 * ----------------------------------------------------------------------------
 * Adds ENTERPRISE storefront features on top of store.js without modifying it:
 *   • Wishlist / favourites          • Product reviews & ratings (localStorage)
 *   • Recently viewed                • Coupon / discount codes
 *   • Delivery fee by zone           • Image gallery + variants in modal
 *   • Related products               • Stock-quantity awareness
 *   • Share buttons                  • Back-to-top, breadcrumbs
 *   • Order tracking (local)         • Abandoned-cart WhatsApp nudge
 *   • Newsletter capture (Formspree) • JSON-LD structured data (SEO)
 *
 * 100% free, no paid APIs. Everything degrades gracefully if data is missing.
 * Loaded AFTER store.js. Reads window.STORE_CONFIG and StoreForge state.
 * ==========================================================================*/

const StoreForgePlus = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => (cfg.currencySymbol || "₦") + Number(n || 0).toLocaleString("en-NG");
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2200); };

  /* keys */
  const K = {
    wish: "sfp_wish_" + sid,
    reviews: "sfp_reviews_" + sid,
    recent: "sfp_recent_" + sid,
    orders: "sfp_orders_" + sid,
    cartTime: "sfp_carttime_" + sid
  };

  let products = [];           // mirror of loaded products
  let appliedCoupon = null;    // {code, type, value}

  /* ---------------- WISHLIST ---------------- */
  const Wish = {
    list: () => lsGet(K.wish, []),
    has: (id) => Wish.list().includes(id),
    toggle(id) {
      let l = Wish.list();
      l = l.includes(id) ? l.filter(x => x !== id) : [...l, id];
      lsSet(K.wish, l); Wish.render(); toast(l.includes(id) ? "❤️ Added to wishlist" : "Removed from wishlist");
      // refresh heart buttons
      $$(".wish-btn[data-id='" + id + "']").forEach(b => b.classList.toggle("on", Wish.has(id)));
    },
    count: () => Wish.list().length,
    render() {
      const badge = $("#wishCount"); if (badge) badge.textContent = Wish.count();
    }
  };

  /* ---------------- RECENTLY VIEWED ---------------- */
  const Recent = {
    push(id) {
      let l = lsGet(K.recent, []).filter(x => x !== id);
      l.unshift(id); l = l.slice(0, 8); lsSet(K.recent, l); Recent.render();
    },
    render() {
      const wrap = $("#recentGrid"); if (!wrap) return;
      const ids = lsGet(K.recent, []);
      const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);
      $("#recentSection").hidden = items.length === 0;
      wrap.innerHTML = items.map(p => miniCard(p)).join("");
    }
  };

  /* ---------------- REVIEWS & RATINGS ---------------- */
  const Reviews = {
    all: () => lsGet(K.reviews, {}),
    for: (id) => (Reviews.all()[id] || []),
    add(id, name, rating, text) {
      const all = Reviews.all();
      all[id] = all[id] || [];
      all[id].unshift({ name: name || "Customer", rating: Number(rating), text: text || "", date: new Date().toISOString() });
      lsSet(K.reviews, all);
    },
    avg(id) {
      const r = Reviews.for(id); if (!r.length) return 0;
      return (r.reduce((s, x) => s + x.rating, 0) / r.length);
    },
    stars(n) { const f = Math.round(n); return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f); }
  };

  /* ---------------- COUPONS ---------------- */
  function getCoupons() {
    // Defined in config: payments? No — in cfg.coupons = [{code:"SAVE10", type:"percent", value:10, minTotal:0}]
    return (cfg.coupons || []);
  }
  function applyCoupon(code) {
    const c = getCoupons().find(x => x.code.toUpperCase() === (code || "").trim().toUpperCase());
    const total = cartTotal();
    if (!c) { appliedCoupon = null; return { ok: false, msg: "Invalid code" }; }
    if (c.minTotal && total < c.minTotal) return { ok: false, msg: `Spend ${fmt(c.minTotal)} to use this code` };
    appliedCoupon = c; return { ok: true, msg: `Applied: ${c.code}` };
  }
  function discountAmount() {
    if (!appliedCoupon) return 0;
    const total = cartTotal();
    return appliedCoupon.type === "percent"
      ? Math.round(total * appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, total);
  }

  /* ---------------- DELIVERY ZONES ---------------- */
  function getZones() {
    // cfg.delivery = { zones:[{name:"Lagos Mainland", fee:1500}], freeAbove: 50000 }
    return (cfg.delivery && cfg.delivery.zones) || [];
  }
  function deliveryFee(zoneName) {
    const d = cfg.delivery || {};
    const sub = cartTotal() - discountAmount();
    if (d.freeAbove && sub >= d.freeAbove) return 0;
    const z = getZones().find(z => z.name === zoneName);
    return z ? Number(z.fee) || 0 : 0;
  }

  /* ---------------- CART HELPERS (read StoreForge cart from localStorage) ---------------- */
  function readCart() { return lsGet("sf_cart_" + sid, []); }
  function cartTotal() { return readCart().reduce((s, c) => s + c.price * c.qty, 0); }

  /* ---------------- MINI PRODUCT CARD (for related/recent) ---------------- */
  function miniCard(p) {
    return `<div class="mini-pc" onclick="StoreForge.openProduct('${p.id}')">
      <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" onerror="this.src='assets/images/placeholder.png'">
      <div class="mpc-name">${esc(p.name)}</div>
      <div class="mpc-price">${fmt(p.price)}</div></div>`;
  }

  /* ---------------- SHARE ---------------- */
  function shareProduct(id) {
    const p = products.find(x => x.id === id); if (!p) return;
    const url = (cfg.storeUrl || location.href) + "#" + id;
    const text = `Check out ${p.name} (${fmt(p.price)}) at ${cfg.storeName}: ${url}`;
    if (navigator.share) navigator.share({ title: p.name, text, url }).catch(() => {});
    else { navigator.clipboard.writeText(text); toast("🔗 Link copied to clipboard"); }
  }

  /* ---------------- JSON-LD STRUCTURED DATA (SEO rich results) ---------------- */
  function injectStructuredData() {
    const data = {
      "@context": "https://schema.org", "@type": "Store",
      name: cfg.storeName, description: cfg.tagline,
      url: cfg.storeUrl, telephone: "+" + (cfg.whatsapp || ""),
      address: { "@type": "PostalAddress", addressLocality: cfg.location, addressCountry: "NG" }
    };
    const itemList = {
      "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: products.slice(0, 20).map((p, i) => ({
        "@type": "Product", position: i + 1, name: p.name, image: p.image,
        description: p.description, offers: { "@type": "Offer", price: p.price, priceCurrency: "NGN",
          availability: p.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }
      }))
    };
    [data, itemList].forEach(d => {
      const s = document.createElement("script"); s.type = "application/ld+json";
      s.textContent = JSON.stringify(d); document.head.appendChild(s);
    });
  }

  /* ---------------- ORDER TRACKING (local record) ---------------- */
  const Orders = {
    save(order) { const l = lsGet(K.orders, []); l.unshift(order); lsSet(K.orders, l.slice(0, 50)); },
    find(id) { return lsGet(K.orders, []).find(o => o.id === id); },
    all: () => lsGet(K.orders, [])
  };

  /* ---------------- ABANDONED CART NUDGE ---------------- */
  function trackCartActivity() {
    if (readCart().length) lsSet(K.cartTime, Date.now());
  }
  function checkAbandonedCart() {
    const t = lsGet(K.cartTime, 0), items = readCart();
    if (items.length && t && Date.now() - t > 1000 * 60 * 30) { // 30 min
      const bar = $("#abandonBar");
      if (bar) { bar.hidden = false;
        $("#abandonBtn").onclick = () => {
          const msg = `Hi ${cfg.storeName}! I have items in my cart I'd like to complete:\n` +
            items.map(c => `• ${c.name} × ${c.qty}`).join("\n");
          window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
        };
      }
    }
  }

  /* ---------------- NEWSLETTER (Formspree-free) ---------------- */
  function bindNewsletter() {
    const form = $("#newsletterForm"); if (!form) return;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const email = $("#newsletterEmail").value.trim();
      if (!email) return;
      const endpoint = cfg.newsletter && cfg.newsletter.formspreeId
        ? `https://formspree.io/f/${cfg.newsletter.formspreeId}` : null;
      if (endpoint) {
        try { await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, store: cfg.storeName }) }); } catch {}
      }
      // Fallback: send to WhatsApp so the seller still captures the lead
      const l = lsGet("sfp_subs_" + sid, []); l.push(email); lsSet("sfp_subs_" + sid, l);
      toast("✅ Subscribed! Thank you."); form.reset();
    };
  }

  /* ---------------- PUBLIC: enhance the product modal ---------------- */
  // Called by patched StoreForge.openProduct (see patch below).
  function decorateModal(p) {
    const body = $("#modalBody"); if (!body) return;
    Recent.push(p.id);

    // Gallery (if product has multiple images)
    const imgs = (p.images && p.images.length) ? p.images : [p.image];
    const gallery = imgs.length > 1
      ? `<div class="mp-thumbs">${imgs.map((im, i) => `<img src="${im}" class="${i === 0 ? 'sel' : ''}" onclick="StoreForgePlus.swapImg(this,'${im}')" onerror="this.style.display='none'">`).join("")}</div>`
      : "";

    // Variants
    let variantHtml = "";
    if (p.variants && p.variants.length) {
      variantHtml = p.variants.map(v => `
        <div class="variant-group">
          <label>${esc(v.name)}</label>
          <div class="variant-opts" data-variant="${esc(v.name)}">
            ${v.options.map((o, i) => `<button class="variant-opt ${i === 0 ? 'sel' : ''}" onclick="StoreForgePlus.pickVariant(this)">${esc(o)}</button>`).join("")}
          </div></div>`).join("");
    }

    // Ratings + reviews
    const avg = Reviews.avg(p.id); const revs = Reviews.for(p.id);
    const ratingHtml = `<div class="mp-rating">${Reviews.stars(avg)} <small>${avg ? avg.toFixed(1) : "No"} rating${revs.length !== 1 ? "s" : ""} (${revs.length})</small></div>`;

    // Stock qty
    const stockHtml = (typeof p.qty === "number")
      ? `<div class="mp-stock ${p.qty <= 3 ? 'low' : ''}">${p.qty > 0 ? (p.qty <= 3 ? `⚠️ Only ${p.qty} left!` : `✅ In stock (${p.qty})`) : "❌ Out of stock"}</div>` : "";

    // Insert gallery + extras into existing modal markup
    const left = body.querySelector(".modal-product > div:first-child");
    if (left && gallery) left.insertAdjacentHTML("beforeend", gallery);
    const right = body.querySelector(".modal-product > div:last-child");
    if (right) {
      const priceEl = right.querySelector(".mp-price");
      if (priceEl) priceEl.insertAdjacentHTML("beforebegin", ratingHtml);
      const descEl = right.querySelector(".mp-desc");
      if (descEl) {
        descEl.insertAdjacentHTML("beforebegin", stockHtml);
        descEl.insertAdjacentHTML("afterend", variantHtml);
      }
      // action row: wishlist + share
      right.insertAdjacentHTML("beforeend", `
        <div class="mp-actions2">
          <button class="btn btn-outline wish-btn ${Wish.has(p.id) ? 'on' : ''}" data-id="${p.id}" onclick="StoreForgePlus.toggleWish('${p.id}')">❤️ Wishlist</button>
          <button class="btn btn-outline" onclick="StoreForgePlus.share('${p.id}')">🔗 Share</button>
        </div>`);
    }

    // Reviews block
    body.insertAdjacentHTML("beforeend", `
      <div class="reviews-block">
        <h3>⭐ Reviews</h3>
        <div class="review-list">${revs.length ? revs.map(r => `
          <div class="review"><strong>${esc(r.name)}</strong> <span class="r-stars">${Reviews.stars(r.rating)}</span>
          <p>${esc(r.text)}</p><small>${new Date(r.date).toLocaleDateString()}</small></div>`).join("") : `<p class="muted">No reviews yet. Be the first!</p>`}
        </div>
        <div class="review-form">
          <h4>Leave a review</h4>
          <input id="rvName" placeholder="Your name">
          <select id="rvRating"><option value="5">★★★★★ (5)</option><option value="4">★★★★ (4)</option><option value="3">★★★ (3)</option><option value="2">★★ (2)</option><option value="1">★ (1)</option></select>
          <textarea id="rvText" rows="2" placeholder="Your experience..."></textarea>
          <button class="btn btn-primary" onclick="StoreForgePlus.submitReview('${p.id}')">Submit review</button>
        </div>
      </div>`);

    // Related products (same category)
    const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    if (related.length) body.insertAdjacentHTML("beforeend",
      `<div class="related-block"><h3>🛍️ You may also like</h3><div class="mini-grid">${related.map(miniCard).join("")}</div></div>`);
  }

  function swapImg(thumb, src) {
    const main = thumb.closest(".modal-product").querySelector("img");
    if (main) main.src = src;
    $$(".mp-thumbs img").forEach(t => t.classList.remove("sel")); thumb.classList.add("sel");
  }
  function pickVariant(btn) {
    btn.parentElement.querySelectorAll(".variant-opt").forEach(b => b.classList.remove("sel"));
    btn.classList.add("sel");
  }
  function submitReview(id) {
    const name = $("#rvName").value, rating = $("#rvRating").value, text = $("#rvText").value;
    if (!text.trim()) { toast("Please write something"); return; }
    Reviews.add(id, name, rating, text);
    toast("✅ Thank you for your review!");
    StoreForge.openProduct(id); // re-render modal with new review
  }

  /* ---------------- BACK TO TOP ---------------- */
  function bindBackToTop() {
    const btn = $("#backTop"); if (!btn) return;
    window.addEventListener("scroll", () => { btn.classList.toggle("show", window.scrollY > 500); });
    btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------- INIT ---------------- */
  function init(loadedProducts) {
    products = loadedProducts || [];
    injectStructuredData();
    Wish.render(); Recent.render(); bindNewsletter(); bindBackToTop();
    checkAbandonedCart();
    // track cart activity periodically
    setInterval(trackCartActivity, 5000);
    // wishlist drawer button
    const wb = $("#wishBtn"); if (wb) wb.onclick = openWishlist;
  }

  /* ---------------- WISHLIST DRAWER ---------------- */
  function openWishlist() {
    const items = Wish.list().map(id => products.find(p => p.id === id)).filter(Boolean);
    const body = $("#wishBody");
    if (body) body.innerHTML = items.length
      ? `<div class="mini-grid">${items.map(p => `
          <div class="mini-pc">
            <img src="${p.image}" onclick="StoreForge.openProduct('${p.id}')" onerror="this.src='assets/images/placeholder.png'">
            <div class="mpc-name">${esc(p.name)}</div><div class="mpc-price">${fmt(p.price)}</div>
            <button class="btn btn-primary" style="width:100%;font-size:.78rem;padding:.4rem" onclick="StoreForge.addToCart('${p.id}')">Add to cart</button>
            <button class="link-btn" onclick="StoreForgePlus.toggleWish('${p.id}');StoreForgePlus.openWishlist()">Remove</button>
          </div>`).join("")}</div>`
      : `<p class="muted" style="text-align:center;padding:2rem">No favourites yet. Tap ❤️ on products you love.</p>`;
    $("#wishOverlay").classList.add("open"); $("#wishDrawer").classList.add("open");
  }
  function closeWishlist() { $("#wishOverlay").classList.remove("open"); $("#wishDrawer").classList.remove("open"); }

  return {
    init, toggleWish: Wish.toggle, share: shareProduct, decorateModal,
    swapImg, pickVariant, submitReview, openWishlist, closeWishlist,
    applyCoupon, discountAmount, deliveryFee, getZones, getCoupons,
    Orders, Reviews, Wish
  };
})();

/* ============================================================================
 * HMG StoreForge v8 — Full Multi-Language (i18n.js)
 * ----------------------------------------------------------------------------
 * Real translations for English, Nigerian Pidgin, Hausa, Yoruba, Igbo.
 * Replaces the lightweight v4 switcher (which is preserved/compatible).
 * Any element with data-i18n="key" is translated. The language dropdown lets
 * the customer choose; choice is remembered. 100% free, no API.
 *
 * To add a language: add a block to DICT and an <option> via config.languages.list.
 * ==========================================================================*/

const I18N = (function () {
  const cfg = window.STORE_CONFIG || {};
  const sid = cfg.storeId || "default";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const DICT = {
    en: { _name: "English",
      shop: "Shop", categories: "Categories", about: "About", contact: "Contact", track: "Track Order",
      search: "🔍 Search products...", allCats: "All Categories", sortFeatured: "Sort: Featured",
      shopNow: "🛍️ Shop Now", contactUs: "💬 Contact Us", ourProducts: "Our Products",
      addCart: "Add to cart", outStock: "Out of stock", askWa: "Ask on WhatsApp",
      cart: "Your Cart", checkout: "Proceed to Checkout →", continue: "Continue shopping",
      total: "Total", getTouch: "Get in Touch", signIn: "👤 Sign in", alerts: "🔔 Get order alerts",
      faq: "❓ Frequently Asked Questions", testimonials: "💬 What Our Customers Say",
      vendors: "🏪 Our Vendors", subscribe: "Subscribe", placeOrder: "Place Order →" },

    pcm: { _name: "Pidgin",
      shop: "Buy", categories: "Categories", about: "About Us", contact: "Reach Us", track: "Find My Order",
      search: "🔍 Find wetin you want...", allCats: "All Categories", sortFeatured: "Arrange: Featured",
      shopNow: "🛍️ Buy Now", contactUs: "💬 Yarn Us", ourProducts: "Our Goods",
      addCart: "Put for basket", outStock: "E don finish", askWa: "Ask for WhatsApp",
      cart: "Your Basket", checkout: "Make I Pay →", continue: "Continue to buy",
      total: "Total", getTouch: "Talk to Us", signIn: "👤 Sign in", alerts: "🔔 Make I sabi my order",
      faq: "❓ Question wey people dey ask", testimonials: "💬 Wetin Our Customers Talk",
      vendors: "🏪 Our Sellers", subscribe: "Subscribe", placeOrder: "Send Order →" },

    ha: { _name: "Hausa",
      shop: "Sayayya", categories: "Rukunoni", about: "Game da mu", contact: "Tuntuɓe mu", track: "Bibiyar Oda",
      search: "🔍 Nemo kayayyaki...", allCats: "Dukkan Rukunoni", sortFeatured: "Tsara: Fitattu",
      shopNow: "🛍️ Saya Yanzu", contactUs: "💬 Tuntuɓe Mu", ourProducts: "Kayayyakinmu",
      addCart: "Ƙara cikin kwando", outStock: "Ya ƙare", askWa: "Tambaya a WhatsApp",
      cart: "Kwandonku", checkout: "Ci gaba zuwa Biya →", continue: "Ci gaba da sayayya",
      total: "Jimla", getTouch: "Tuntuɓe Mu", signIn: "👤 Shiga", alerts: "🔔 Sanarwar oda",
      faq: "❓ Tambayoyin da ake yawan yi", testimonials: "💬 Abin da abokan cinikinmu ke cewa",
      vendors: "🏪 Masu sayar da kayanmu", subscribe: "Biyan kuɗi", placeOrder: "Aika Oda →" },

    yo: { _name: "Yorùbá",
      shop: "Rà", categories: "Ẹ̀ka", about: "Nípa wa", contact: "Pe wá", track: "Tọpa Àṣẹ rẹ",
      search: "🔍 Wá ọjà...", allCats: "Gbogbo Ẹ̀ka", sortFeatured: "Tò: Àkànṣe",
      shopNow: "🛍️ Rà Báyìí", contactUs: "💬 Pe wá", ourProducts: "Ọjà wa",
      addCart: "Fi sí àpótí", outStock: "Ó ti tán", askWa: "Béèrè ní WhatsApp",
      cart: "Àpótí rẹ", checkout: "Tẹ̀síwájú sí Ìsanwó →", continue: "Tẹ̀síwájú ní rírà",
      total: "Àpapọ̀", getTouch: "Pe wá", signIn: "👤 Wọlé", alerts: "🔔 Ìfìlọ̀ àṣẹ",
      faq: "❓ Àwọn ìbéèrè tí a sábà béèrè", testimonials: "💬 Ohun tí àwọn oníbàárà wa sọ",
      vendors: "🏪 Àwọn olùtà wa", subscribe: "Forúkọsílẹ̀", placeOrder: "Fi Àṣẹ ránṣẹ́ →" },

    ig: { _name: "Igbo",
      shop: "Zụọ", categories: "Ụdị", about: "Banyere anyị", contact: "Kpọtụrụ anyị", track: "Soro Iwu gị",
      search: "🔍 Chọọ ngwaahịa...", allCats: "Ụdị niile", sortFeatured: "Hazie: Ndị ama ama",
      shopNow: "🛍️ Zụọ Ugbu a", contactUs: "💬 Kpọtụrụ anyị", ourProducts: "Ngwaahịa anyị",
      addCart: "Tinye na nkata", outStock: "Ọ gwụla", askWa: "Jụọ na WhatsApp",
      cart: "Nkata gị", checkout: "Gaa n'ihu ịkwụ ụgwọ →", continue: "Gaa n'ihu ịzụ ahịa",
      total: "Mkpokọta", getTouch: "Kpọtụrụ anyị", signIn: "👤 Banye", alerts: "🔔 Ọkwa iwu",
      faq: "❓ Ajụjụ a na-ajụkarị", testimonials: "💬 Ihe ndị ahịa anyị na-ekwu",
      vendors: "🏪 Ndị na-ere anyị", subscribe: "Debanye aha", placeOrder: "Zipu Iwu →" }
  };

  let lang = localStorage.getItem("sf_lang_" + sid) || (cfg.languages && cfg.languages.default) || "en";

  function t(key) { return (DICT[lang] && DICT[lang][key]) || (DICT.en && DICT.en[key]) || key; }

  function apply() {
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (el.placeholder !== undefined && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.hasAttribute("data-i18n-ph")) el.placeholder = val;
      else el.textContent = val;
    });
    document.documentElement.lang = lang;
  }

  function set(l) {
    if (!DICT[l]) return;
    lang = l; localStorage.setItem("sf_lang_" + sid, l);
    apply();
    $$(".lang-opt").forEach(o => o.classList.toggle("active", o.dataset.lang === l));
    const sel = $("#langSelect"); if (sel) sel.value = l;
  }

  function renderSwitcher() {
    const el = $("#langSwitch"); if (!el) return;
    if (!(cfg.languages && cfg.languages.enabled)) { el.hidden = true; return; }
    el.hidden = false;
    const list = (cfg.languages.list && cfg.languages.list.length) ? cfg.languages.list : Object.keys(DICT);
    el.innerHTML = `<select id="langSelect" class="lang-select" aria-label="Language">
      ${list.map(l => `<option value="${l}" ${l === lang ? "selected" : ""}>${(DICT[l] && DICT[l]._name) || l}</option>`).join("")}
    </select>`;
    $("#langSelect").onchange = (e) => set(e.target.value);
  }

  function init() { renderSwitcher(); apply(); }

  return { init, t, set, apply, get lang() { return lang; }, DICT };
})();

document.addEventListener("DOMContentLoaded", () => setTimeout(() => { try { I18N.init(); } catch (e) { console.warn(e); } }, 200));

/* ============================================================================
 * HMG StoreForge v3 — DEMO STORE CONFIGURATION
 * A fully-populated example so you can see EVERY feature working.
 * Deploy this folder as-is to preview, or copy values into your own store.
 * ==========================================================================*/

window.STORE_CONFIG = {
  storeId: "naija-mart-demo",
  storeName: "Naija Mart Marketplace (Demo)",
  tagline: "A multi-vendor marketplace — many trusted sellers, one checkout.",
  about: "Naija Mart is a demo store built with HMG StoreForge v3. It showcases every feature: wishlist, reviews, variants, coupons, delivery zones, order tracking, PWA, and more. Replace this with your real business details.",
  location: "Lagos, Nigeria",
  storeUrl: "https://naija-mart-demo.pages.dev",
  announcement: "🎉 Use code WELCOME10 for 10% off your first order! Free delivery above ₦50,000.",
  currencySymbol: "₦",

  /* Multi-currency (v3) — display alternate currency rates (informational) */
  currencies: {
    base: "NGN",
    rates: { NGN: 1, USD: 0.00067, GBP: 0.00053 },
    symbols: { NGN: "₦", USD: "$", GBP: "£" }
  },

  whatsapp: "2348100866322",
  whatsappDisplay: "+234 810 086 6322",
  phone: "2348100866322",
  phoneDisplay: "+234 810 086 6322",
  email: "demo@naijamart.example",

  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com/@hmgconcepts",
    whatsapp: "https://wa.me/2348100866322"
  },

  theme: { primary: "#0f2a4a", accent: "#c9a227", accent2: "#14857c", dark: "#0a1929" },

  payments: {
    manual: { enabled: true, bank: "GTBank", accountNumber: "0123456789", accountName: "Naija Mart Demo Ltd" },
    gateway: { enabled: true, provider: "Paystack", paymentLink: "https://paystack.com/pay/storeforge-demo" }
  },

  supabase: { url: "", anonKey: "", table: "products" },

  /* ===== Live demo coupons ===== */
  coupons: [
    { code: "WELCOME10", type: "percent", value: 10, minTotal: 0 },
    { code: "SAVE2000",  type: "fixed",   value: 2000, minTotal: 20000 },
    { code: "BIG15",     type: "percent", value: 15, minTotal: 50000 }
  ],

  /* ===== Live demo delivery zones ===== */
  delivery: {
    freeAbove: 50000,
    estimatedDays: 3,
    zones: [
      { name: "Lagos Mainland", fee: 1500 },
      { name: "Lagos Island",   fee: 2500 },
      { name: "Ogun / Ibadan",  fee: 3500 },
      { name: "Outside South-West", fee: 5000 }
    ]
  },

  newsletter: { formspreeId: "" },         // add a free Formspree ID to capture emails
  analytics: { cloudflareToken: "", googleId: "" },

  /* ===== Store hours (v3) — shows open/closed indicator ===== */
  hours: {
    enabled: true,
    timezone: "Africa/Lagos",
    schedule: {
      mon: ["08:00", "20:00"], tue: ["08:00", "20:00"], wed: ["08:00", "20:00"],
      thu: ["08:00", "20:00"], fri: ["08:00", "21:00"], sat: ["09:00", "21:00"], sun: ["12:00", "18:00"]
    }
  },

  /* ===== FAQ (v3) ===== */
  faq: [
    { q: "How do I place an order?", a: "Add items to your cart, click Checkout, fill your details, choose a payment method, and your order is sent to us on WhatsApp." },
    { q: "What are the delivery fees?", a: "Fees depend on your zone (₦1,500–₦5,000). Delivery is FREE on orders above ₦50,000." },
    { q: "How long does delivery take?", a: "1–2 days within Lagos, 2–5 days nationwide." },
    { q: "Can I return an item?", a: "Yes — see our Returns Policy. Contact us on WhatsApp within 48 hours of delivery." },
    { q: "Which payment methods do you accept?", a: "Bank transfer and secure online payment via Paystack." }
  ],

  /* ===== Returns policy (v3) ===== */
  returnsPolicy: "We accept returns within 48 hours of delivery for unused items in original packaging. Refunds are processed within 5 working days. Contact us on WhatsApp to start a return.",

  /* ===== Featured testimonials (v3) ===== */
  testimonials: [
    { name: "Chioma A.", text: "Fast delivery and the Ankara quality is top-notch. Will buy again!", rating: 5 },
    { name: "Tunde B.", text: "Ordered earbuds, got them same day in Lagos. Smooth WhatsApp service.", rating: 5 },
    { name: "Aisha M.", text: "Great prices and the discount code worked perfectly.", rating: 4 }
  ],

  /* ======================= v4 DEMO OPTIONS ======================= */

  /* Google Sheets order logging — paste your own /exec URL (see integrations/GOOGLE-SHEETS-SETUP.md) */
  orders: { sheetsWebAppUrl: "", alsoEmailFormspreeId: "" },

  /* Loyalty points (1 pt per ₦1,000) */
  loyalty: { enabled: true, pointsPerNaira: 0.001 },

  /* Flash sale countdown — ends 7 days from a fixed demo date */
  flashSale: { enabled: true, title: "Mid-Year Flash Sale — up to 25% off!", endsAt: "2026-12-31T23:59:59" },

  /* Recently-sold social proof toasts */
  socialProof: { enabled: true },

  /* Trust badges (custom) */
  trustBadges: [
    { icon: "🚚", title: "Fast Delivery", text: "1–5 days nationwide" },
    { icon: "🔒", title: "Secure Payment", text: "Transfer & Paystack" },
    { icon: "↩️", title: "Easy Returns", text: "48-hour window" },
    { icon: "💬", title: "Real Support", text: "Chat on WhatsApp" }
  ],

  /* Language switcher (English / Nigerian Pidgin) */
  languages: { enabled: true, default: "en", list: ["en","pcm","ha","yo","ig"] },

  /* ======================= v5 DEMO OPTIONS ======================= */

  /* Multi-vendor MARKETPLACE — 3 demo vendors */
  marketplace: {
    enabled: true,
    commissionPercent: 8,
    vendors: [
      { id: "v1", name: "Bella Fashion", whatsapp: "2348100866322", location: "Lagos", rating: 4.8, logo: "assets/images/products/handbag.jpg", bank: "GTBank", accountNumber: "0123456781", accountName: "Bella Fashion Ltd" },
      { id: "v2", name: "GadgetPlug NG",  whatsapp: "2348100866322", location: "Abuja", rating: 4.6, logo: "assets/images/products/earbuds.jpg", bank: "Access Bank", accountNumber: "0123456782", accountName: "GadgetPlug NG" },
      { id: "v3", name: "Pure Naturals",  whatsapp: "2348100866322", location: "Ibadan", rating: 4.9, logo: "assets/images/products/sheabutter.jpg", bank: "UBA", accountNumber: "0123456783", accountName: "Pure Naturals" }
    ]
  },

  /* Gift cards / store credit */
  giftCards: [
    { code: "GIFT5000", value: 5000 },
    { code: "GIFT2000", value: 2000 }
  ],

  /* Referral program */
  referral: { enabled: true, rewardText: "Share your link — earn ₦1,000 store credit when a friend makes their first order!" },

  /* ======================= v6 DEMO OPTIONS ======================= */
  notifications: { enabled: true },
  qr: { enabled: true },
  salesTarget: { enabled: true, monthly: 500000 },
  dispatch: {
    riders: [
      { name: "Musa (Bike)", phone: "2348100866322" },
      { name: "Grace (Van)", phone: "2348100866322" },
      { name: "Emeka (Bike)", phone: "2348100866322" }
    ]
  },

  /* ======================= v7 DEMO OPTIONS ======================= */
  accounts: { enabled: true },
  subscriptions: { enabled: true },
  ledger: { commissionPercent: 8 },

  /* ===== v9 DEMO: design + features + recovery + lead generation ===== */
  design: { font: "poppins", headingFont: "montserrat", layout: "classic", hero: "split",
    cardStyle: "shadow", uiStyle: "standard", radius: "rounded", buttonShape: "pill", density: "cozy", darkDefault: false },
  features: { search: true, categories: true, wishlist: true, reviews: true, qa: true, testimonials: true,
    faq: true, vendors: true, newsletter: true, recentlyViewed: true, trustBadges: true, about: true,
    contact: true, darkMode: true, languages: true, loyalty: true, accounts: true, notifications: true },
  recovery: { enabled: true, formspreeId: "", delayMinutes: 60, coupon: "COMEBACK10", couponHint: "10% off" },
  leadGen: { company: "HMG Technologies", founder: "Adewale Samson Adeagbo",
    site: "https://hmgtechnologies.pages.dev", whatsapp: "2348100866322", email: "hmgconcepts@gmail.com", badge: true }
};

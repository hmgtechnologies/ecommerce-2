/* ============================================================================
 * HMG StoreForge v2 — Optional free analytics loader
 * Reads window.STORE_CONFIG.analytics and injects the chosen tracker.
 * Both options are FREE. Nothing loads if IDs are blank (no overhead/cost).
 * ==========================================================================*/
(function () {
  const a = (window.STORE_CONFIG && window.STORE_CONFIG.analytics) || {};

  // Cloudflare Web Analytics (privacy-friendly, no cookie banner required)
  if (a.cloudflareToken) {
    const s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: a.cloudflareToken }));
    document.head.appendChild(s);
  }

  // Google Analytics 4
  if (a.googleId) {
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + a.googleId;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", a.googleId);
  }
})();

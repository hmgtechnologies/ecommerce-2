/* ============================================================================
 * HMG StoreForge v2 — Built-in demo products (used only if Supabase AND
 * products.json are both unavailable). Replace freely via the Admin panel.
 * Showcases v2 fields: qty, variants, gallery images, sku.
 * ==========================================================================*/
window.PRODUCTS_FALLBACK = [
  { id:"p1", name:"Sample Ankara Fabric (6 yards)", price:18000, oldPrice:22000,
    category:"Fashion", featured:true, stock:true, qty:12, sku:"ANK-001",
    images:["assets/images/placeholder.png","assets/images/hero.jpg"],
    variants:[{name:"Length",options:["3 yards","6 yards"]}],
    description:"Premium quality Ankara fabric. 6 yards. Vibrant colours that never fade.\nPerfect for native wear and gowns.",
    image:"assets/images/placeholder.png" },
  { id:"p2", name:"Wireless Earbuds Pro", price:25000, category:"Electronics", stock:true, qty:3, sku:"EAR-002",
    variants:[{name:"Colour",options:["Black","White"]}],
    description:"Bluetooth 5.3 earbuds with noise cancellation and 24-hour battery life.",
    image:"assets/images/placeholder.png" },
  { id:"p3", name:"Shea Butter Body Cream 500ml", price:6500, category:"Beauty", featured:true, stock:true, qty:40, sku:"BEA-003",
    description:"100% natural shea butter blend. Deeply moisturising for all skin types.",
    image:"assets/images/placeholder.png" },
  { id:"p4", name:"Handmade Leather Sandals", price:14000, category:"Fashion", stock:false, sku:"FAS-004",
    variants:[{name:"Size",options:["40","41","42","43","44"]}],
    description:"Genuine leather, locally crafted. Durable and comfortable. Currently restocking.",
    image:"assets/images/placeholder.png" }
];

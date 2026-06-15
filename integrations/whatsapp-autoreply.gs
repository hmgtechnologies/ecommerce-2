/* ============================================================================
 * HMG StoreForge v5 — WhatsApp Cloud API Auto-Reply (Apps Script webhook)
 * ----------------------------------------------------------------------------
 * FREE auto-responder for your store's WhatsApp using Meta's WhatsApp Cloud API
 * (which has a generous FREE tier). Runs as a Google Apps Script Web App — no
 * server, no hosting cost. It replies to incoming customer messages with a menu:
 * catalog link, store hours, order help, and a hand-off to a human.
 *
 * ⚠️ This is a SCAFFOLD. WhatsApp Cloud API setup (Meta business account, phone
 * number, tokens) is required. See integrations/WHATSAPP-AUTOREPLY-SETUP.md.
 * The WhatsApp Cloud API itself has a free conversation tier — no AI API used.
 *
 * SET THESE (from Meta → WhatsApp → API setup):
 * ==========================================================================*/
var VERIFY_TOKEN   = "storeforge_verify_123";        // you choose this; paste same value in Meta
var WHATSAPP_TOKEN = "PASTE_YOUR_PERMANENT_TOKEN";   // Meta access token
var PHONE_NUMBER_ID = "PASTE_YOUR_PHONE_NUMBER_ID";  // Meta WhatsApp phone number ID

// Your store details (used in replies)
var STORE_NAME = "My Store";
var STORE_URL  = "https://my-store.pages.dev";
var STORE_HOURS = "Mon–Sat 8am–8pm, Sun 12–6pm";

/* ---- Webhook verification (Meta calls this once with GET) ---- */
function doGet(e) {
  var p = e.parameter;
  if (p["hub.mode"] === "subscribe" && p["hub.verify_token"] === VERIFY_TOKEN) {
    return ContentService.createTextOutput(p["hub.challenge"]);
  }
  return ContentService.createTextOutput("OK");
}

/* ---- Incoming messages (Meta POSTs here) ---- */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var entry = (body.entry && body.entry[0]) || {};
    var change = (entry.changes && entry.changes[0]) || {};
    var value = change.value || {};
    var msg = (value.messages && value.messages[0]) || null;
    if (!msg) return ok();

    var from = msg.from; // customer's number
    var text = ((msg.text && msg.text.body) || "").toLowerCase().trim();

    var reply;
    if (text.match(/\b(hi|hello|hey|menu|start|good)\b/)) {
      reply = "👋 Welcome to " + STORE_NAME + "!\n\nReply with a number:\n" +
              "1️⃣ Browse catalog\n2️⃣ Store hours\n3️⃣ Track my order\n4️⃣ Talk to a human";
    } else if (text === "1" || text.indexOf("catalog") >= 0 || text.indexOf("shop") >= 0) {
      reply = "🛍️ Browse our full catalog here:\n" + STORE_URL +
              "\n\nAdd items to cart and checkout — your order comes straight to us!";
    } else if (text === "2" || text.indexOf("hour") >= 0 || text.indexOf("open") >= 0) {
      reply = "🕒 Our hours: " + STORE_HOURS;
    } else if (text === "3" || text.indexOf("order") >= 0 || text.indexOf("track") >= 0) {
      reply = "📦 Track your order here:\n" + STORE_URL + "/track.html\n" +
              "Enter your Order ID (e.g. ORD-123456).";
    } else if (text === "4" || text.indexOf("human") >= 0 || text.indexOf("agent") >= 0) {
      reply = "🙋 A team member will reply shortly. Thank you for your patience!";
    } else {
      reply = "I didn't catch that 🤔. Reply *menu* to see options, or just tell us what you need!";
    }

    sendMessage(from, reply);
    return ok();
  } catch (err) {
    return ok(); // always 200 so Meta doesn't retry endlessly
  }
}

function sendMessage(to, text) {
  var url = "https://graph.facebook.com/v20.0/" + PHONE_NUMBER_ID + "/messages";
  var payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: { body: text }
  };
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + WHATSAPP_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

function ok() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

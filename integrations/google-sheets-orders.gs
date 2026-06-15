/* ============================================================================
 * HMG StoreForge v4 — Google Sheets Order Logger (Apps Script)
 * ----------------------------------------------------------------------------
 * FREE. No API key, no billing. Logs every order from your store into a Google
 * Sheet, and (optionally) emails you a notification per order.
 *
 * HOW IT WORKS:
 *   Your store POSTs each order (as JSON) to a Google Apps Script "Web App" URL.
 *   This script appends a row to the active sheet and emails you.
 *
 * SETUP (one-time, ~5 minutes) — see integrations/GOOGLE-SHEETS-SETUP.md:
 *   1. Create a new Google Sheet (sheets.new).
 *   2. Extensions → Apps Script. Delete any code, paste THIS file.
 *   3. Set NOTIFY_EMAIL below to your email (or leave "" to disable emails).
 *   4. Deploy → New deployment → type "Web app" →
 *        Execute as: Me ·  Who has access: Anyone
 *      Copy the Web app URL (ends with /exec).
 *   5. Put that URL in your store config.js → orders.sheetsWebAppUrl.
 * ==========================================================================*/

// ⬇️ OPTIONAL: get an email per order. Leave "" to disable.
var NOTIFY_EMAIL = "";

// The tab (sheet) name to write to. Created automatically if missing.
var SHEET_NAME = "Orders";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Write header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Order ID", "Store", "Customer", "Phone", "Address",
        "Items", "Subtotal", "Discount", "Delivery", "Zone", "Total",
        "Payment", "Status", "Notes"
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var items = (data.items || []).map(function (i) {
      return i.name + " x" + i.qty + " (" + (i.price || 0) + ")";
    }).join("; ");

    sheet.appendRow([
      new Date(), data.id || "", data.store || "", data.customer || "",
      "'" + (data.phone || ""), data.address || "", items,
      data.subtotal || 0, data.discount || 0, data.delivery || 0,
      data.zone || "", data.total || 0, data.method || "",
      data.status || "pending", data.notes || ""
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "🛒 New order " + (data.id || "") + " — " + (data.store || ""),
        body: "Customer: " + data.customer + "\nPhone: " + data.phone +
              "\nTotal: " + data.total + "\nItems:\n" + items +
              "\nAddress: " + data.address + "\nPayment: " + data.method
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Simple GET so you can test the URL in a browser.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "HMG StoreForge orders endpoint is live." }))
    .setMimeType(ContentService.MimeType.JSON);
}

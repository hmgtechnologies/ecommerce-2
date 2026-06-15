# 💳 Payments Guide — HMG StoreForge

StoreForge supports **two payment methods**, both free to set up. A store can use one or both.
Customers choose a method at checkout.

---

## Method 1 — Bank Transfer (manual) — 100% free, zero fees

**How it works:** At checkout the customer sees the seller's bank details, transfers the money, then
sends proof on WhatsApp. The seller confirms and ships.

**Configure (in the generator or `config.js`):**
```js
payments: {
  manual: {
    enabled: true,
    bank: "GTBank",
    accountNumber: "0123456789",
    accountName: "Bella Fashion Ltd"
  }
}
```

**Pros:** No fees, no signup, instant to set up, trusted in Nigeria.
**Cons:** Manual confirmation; customer must send proof.

---

## Method 2 — Online Payment (Paystack / Flutterwave)

**How it works:** The customer is sent to the seller's secure Paystack/Flutterwave payment page, pays
by card or bank, then returns and confirms on WhatsApp.

### Setting up Paystack (free account, pay-as-you-go fees)
1. Create a free account at https://paystack.com (Nigerian business).
2. Complete business verification.
3. Easiest no-code option: **Paystack → Payment Pages → Create Payment Page**, set it to a flexible/
   customer-entered amount, and copy the page link (e.g. `https://paystack.com/pay/your-store`).
4. Paste that link into the generator's **Payment link** field (or `config.js`):
```js
gateway: {
  enabled: true,
  provider: "Paystack",
  paymentLink: "https://paystack.com/pay/your-store"
}
```

### Setting up Flutterwave (alternative)
1. Create an account at https://flutterwave.com.
2. Use **Payment Links** to create a reusable link.
3. Paste it as the `paymentLink` and set `provider: "Flutterwave"`.

**Pros:** Instant card/bank payments; professional.
**Cons:** Small per-transaction fee (deducted by the provider, not by StoreForge). No monthly cost.

> 💡 Because a payment page link uses a flexible amount, the customer enters the cart total shown in
> the order summary. For exact, automated amounts per order, a developer can integrate Paystack
> Inline checkout — ask HMG if you need this advanced option.

---

## Recommended setup for most Nigerian stores
Enable **both**:
- Bank Transfer for buyers who prefer it (no fees), and
- Paystack link for card payments and out-of-town buyers.

Every order — regardless of method — also reaches the seller on **WhatsApp** with full details, so
nothing is lost.

---

## What the customer experiences
1. Adds items to cart → **Checkout**.
2. Enters name, phone, address.
3. Chooses **Bank Transfer**, **Pay Online**, or **Order via WhatsApp**.
4. Clicks **Place Order** → WhatsApp opens with the full order (and bank details or payment link as
   relevant).

💬 Questions? WhatsApp HMG: https://wa.me/2348100866322

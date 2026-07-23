import "server-only";

// bKash PGW (Checkout) integration — SCAFFOLD.
//
// Right now the store uses a MANUAL bKash advance: the customer sends the 75%
// advance to your bKash number and shares the transaction ID (via the order /
// WhatsApp flow). That needs no API and works today.
//
// To take payments automatically, you need a bKash MERCHANT account (requires a
// registered business). Once you have credentials, fill these env vars in
// .env.local + Vercel and implement the two functions below, then wire up
// /api/bkash/create + /api/bkash/execute.
//
// Docs: https://developer.bka.sh/

export const bkashConfigured = Boolean(
  process.env.BKASH_APP_KEY &&
    process.env.BKASH_APP_SECRET &&
    process.env.BKASH_USERNAME &&
    process.env.BKASH_PASSWORD,
);

const BASE = process.env.BKASH_BASE_URL || "https://tokenized.sandbox.bka.sh/v1.2.0-beta";

type Grant = { id_token: string };

// Get a bearer token from bKash (valid ~1hr). TODO: cache it.
export async function bkashGrantToken(): Promise<string> {
  if (!bkashConfigured) throw new Error("bkash_not_configured");
  const res = await fetch(`${BASE}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: process.env.BKASH_USERNAME!,
      password: process.env.BKASH_PASSWORD!,
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    }),
  });
  const data = (await res.json()) as Grant;
  if (!data.id_token) throw new Error("bkash_token_failed");
  return data.id_token;
}

// Create a payment and return the bKash URL to redirect the customer to.
export async function bkashCreatePayment(params: {
  amount: number;
  orderId: string;
  callbackUrl: string;
}): Promise<{ bkashURL: string; paymentID: string }> {
  const token = await bkashGrantToken();
  const res = await fetch(`${BASE}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      "X-App-Key": process.env.BKASH_APP_KEY!,
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: params.orderId,
      callbackURL: params.callbackUrl,
      amount: String(params.amount),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: params.orderId,
    }),
  });
  const data = (await res.json()) as { bkashURL?: string; paymentID?: string };
  if (!data.bkashURL || !data.paymentID) throw new Error("bkash_create_failed");
  return { bkashURL: data.bkashURL, paymentID: data.paymentID };
}

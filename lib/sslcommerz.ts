// SSLCommerz integration — PHASE 2 STUB (not wired up yet).
//
// Right now the store runs on Cash on Delivery + manual bKash via the WhatsApp
// handoff in app/order/OrderForm.tsx, so no merchant account is required to start
// selling. When you have registered your business and received SSLCommerz store
// credentials, set `paymentsLive = true` in lib/brand.ts and implement the two
// functions below, then add API routes that call them.
//
// Docs: https://developer.sslcommerz.com/
// You will get: STORE_ID, STORE_PASSWORD (keep these in .env.local, never commit).

export type OrderPayload = {
  orderId: string;
  amount: number; // BDT
  customerName: string;
  customerPhone: string;
  productName: string;
};

// TODO(phase-2): POST to SSLCommerz to open a payment session and return the
// gateway URL to redirect the customer to.
export async function initPayment(_order: OrderPayload): Promise<string> {
  throw new Error("SSLCommerz not configured yet. See lib/sslcommerz.ts.");
}

// TODO(phase-2): validate the IPN/callback from SSLCommerz before marking paid.
export async function verifyPayment(_ipn: unknown): Promise<boolean> {
  throw new Error("SSLCommerz not configured yet. See lib/sslcommerz.ts.");
}

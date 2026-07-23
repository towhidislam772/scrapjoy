import { NextRequest, NextResponse } from "next/server";
import { bkashConfigured, bkashCreatePayment } from "@/lib/bkash";

// POST /api/bkash/create  { amount, orderId }
// Returns a bKash redirect URL. Until you add merchant credentials, returns 501
// so the order flow uses the manual bKash advance instead.
export async function POST(req: NextRequest) {
  if (!bkashConfigured) {
    return NextResponse.json({ error: "bkash_not_configured" }, { status: 501 });
  }

  let body: { amount?: number; orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!amount || amount <= 0 || !body.orderId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;
    const result = await bkashCreatePayment({
      amount,
      orderId: body.orderId,
      callbackUrl: `${origin}/api/bkash/callback`,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "bkash_error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// POST /api/coupon  { code, subtotal }  → validates and returns the discount.
export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ valid: false, message: "Coupons not available yet." }, { status: 200 });

  let body: { code?: string; subtotal?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request." }, { status: 400 });
  }

  const code = (body.code || "").trim().toUpperCase();
  const subtotal = Number(body.subtotal) || 0;
  if (!code) return NextResponse.json({ valid: false, message: "Enter a code." });

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, message: "That code isn't valid." });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, message: "That code has expired." });
  }
  if (subtotal < (coupon.min_order || 0)) {
    return NextResponse.json({
      valid: false,
      message: `Spend at least ৳${coupon.min_order} to use this code.`,
    });
  }

  const discount =
    coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return NextResponse.json({
    valid: true,
    code,
    discount,
    message: `Code applied — you saved ৳${discount}!`,
  });
}

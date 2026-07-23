import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// GET /api/reviews — latest approved reviews (public, for the site).
export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ reviews: [] });

  const { data } = await supabase
    .from("reviews")
    .select("id, customer_name, rating, body, verified, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return NextResponse.json({ reviews: data ?? [] });
}

// POST /api/reviews — submit a review. Verifies the reviewer via their auth
// token and marks it "verified" if they actually have an order.
export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 501 });

  let body: { access_token?: string; rating?: number; body?: string; customer_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.access_token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Verify the user from their access token.
  const { data: userData, error: userErr } = await supabase.auth.getUser(body.access_token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = userData.user.id;

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "bad_rating" }, { status: 400 });
  }
  if (!body.body || body.body.trim().length < 3) {
    return NextResponse.json({ error: "empty_review" }, { status: 400 });
  }

  // Verified = the reviewer has at least one order.
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  const verified = (count ?? 0) > 0;

  const { error } = await supabase.from("reviews").insert({
    user_id: userId,
    customer_name: (body.customer_name || "Customer").slice(0, 60),
    rating,
    body: body.body.slice(0, 1000),
    verified,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, verified });
}

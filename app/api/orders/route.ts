import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// POST /api/orders — create an order row. Returns { id } used to group the
// customer's uploaded photos in Storage. If Supabase isn't configured yet,
// responds 501 so the client can fall back to the WhatsApp flow.
export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "not_configured" },
      { status: 501 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Whitelist the fields we accept (never trust the client blindly).
  const row = {
    product_slug: str(body.product_slug),
    product_name: str(body.product_name),
    price: num(body.price),
    cover_style: str(body.cover_style),
    title: str(body.title),
    subtitle: str(body.subtitle),
    customer_name: str(body.customer_name),
    phone: str(body.phone),
    city: str(body.city),
    address: str(body.address),
    occasion: str(body.occasion),
    payment: str(body.payment),
    photo_count: num(body.photo_count) ?? 0,
  };

  if (!row.customer_name || !row.phone || !row.address) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

function str(v: unknown): string {
  return typeof v === "string" ? v.slice(0, 2000) : "";
}
function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

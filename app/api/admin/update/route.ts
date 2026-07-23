import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const ALLOWED_STATUSES = [
  "new",
  "designing",
  "approved",
  "printing",
  "shipped",
  "done",
  "cancelled",
];

// POST /api/admin/update  { password, id, status }
export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 501 });
  }

  let body: { password?: string; id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!body.id || !body.status || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 501 });
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: body.status })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

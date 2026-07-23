import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { PHOTO_BUCKET } from "@/lib/supabase";

// POST /api/admin/orders  { password }
// Returns all orders (newest first) with public URLs of any uploaded photos.
// Protected by ADMIN_PASSWORD. This is a simple gate suitable for a small shop —
// upgrade to real auth later if you add staff accounts.
export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 501 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 501 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Attach public photo URLs per order (grouped by the order id folder).
  const withPhotos = await Promise.all(
    (orders ?? []).map(async (o) => {
      const { data: files } = await supabase.storage.from(PHOTO_BUCKET).list(o.id, {
        limit: 100,
      });
      // Private bucket: generate short-lived signed URLs (admin-only access).
      const photos = (
        await Promise.all(
          (files ?? [])
            .filter((f) => f.name)
            .map(async (f) => {
              const { data } = await supabase.storage
                .from(PHOTO_BUCKET)
                .createSignedUrl(`${o.id}/${f.name}`, 3600);
              return data?.signedUrl ?? "";
            }),
        )
      ).filter(Boolean);
      return { ...o, photos };
    }),
  );

  return NextResponse.json({ orders: withPhotos });
}

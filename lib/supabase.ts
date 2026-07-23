import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Public (browser-safe) Supabase config. Used for uploading customer photos to
// Storage. Safe to expose — these keys are meant to be public and are guarded by
// Row Level Security / bucket policies on the Supabase side.
// Clean the URL defensively: trim spaces, drop a trailing slash or a stray
// "/rest/v1" that people sometimes copy — any of these break requests.
export function cleanSupabaseUrl(u?: string) {
  if (!u) return u;
  return u.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

export const SUPABASE_URL = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// True once you've added your Supabase keys to .env.local. Until then the site
// gracefully falls back to the WhatsApp order flow (no backend needed).
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const PHOTO_BUCKET = "order-photos";

let browserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

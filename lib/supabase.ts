import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Public (browser-safe) Supabase config. Used for uploading customer photos to
// Storage. Safe to expose — these keys are meant to be public and are guarded by
// Row Level Security / bucket policies on the Supabase side.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// True once you've added your Supabase keys to .env.local. Until then the site
// gracefully falls back to the WhatsApp order flow (no backend needed).
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const PHOTO_BUCKET = "order-photos";

let browserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
  }
  return browserClient;
}

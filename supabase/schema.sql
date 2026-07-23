-- Scrapjoy — Supabase schema & storage setup
-- Run this in your Supabase project: SQL Editor → paste → Run.
-- Then create the storage bucket (instructions at the bottom).

-- 1) Orders table -----------------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        text not null default 'new',      -- new | designing | approved | printing | shipped | done
  product_slug  text,
  product_name  text,
  price         integer,
  cover_style   text,
  title         text,
  subtitle      text,
  customer_name text,
  phone         text,
  city          text,
  address       text,
  occasion      text,
  payment       text,                              -- 'Cash on Delivery' | 'bKash (advance)'
  photo_count   integer default 0,
  notes         text
);

-- Enable Row Level Security. No public policies are added, so the anon key
-- CANNOT read or write orders. Only the service-role key (used server-side in
-- our API routes) can — which is exactly what we want.
alter table public.orders enable row level security;

-- 2) Storage bucket for customer photos -------------------------------------
-- Create a PUBLIC bucket named 'order-photos':
--   Dashboard → Storage → New bucket → name: order-photos → Public: ON → Create
--
-- Then allow anonymous UPLOADS into it (so customers can send photos without an
-- account). Run this SQL after creating the bucket:

insert into storage.buckets (id, name, public)
values ('order-photos', 'order-photos', true)
on conflict (id) do update set public = true;

-- Allow anyone to upload (insert) objects into the order-photos bucket.
drop policy if exists "anon upload order photos" on storage.objects;
create policy "anon upload order photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'order-photos');

-- Allow public read of order photos (so you can view/download them from admin).
drop policy if exists "public read order photos" on storage.objects;
create policy "public read order photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'order-photos');

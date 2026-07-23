-- Scrapjoy — Accounts, Reviews & Coupons
-- Run this AFTER schema.sql (SQL Editor → paste → Run).

-- 1) Link orders to accounts + coupons -------------------------------------
alter table public.orders add column if not exists user_id uuid;
alter table public.orders add column if not exists email text;
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount integer default 0;

-- Let signed-in customers read THEIR OWN orders (for order history).
drop policy if exists "own orders read" on public.orders;
create policy "own orders read"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

-- 2) Reviews ----------------------------------------------------------------
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  user_id       uuid,
  customer_name text,
  product_slug  text,
  rating        int check (rating between 1 and 5),
  body          text,
  verified      boolean default false,   -- true if the reviewer has a real order
  approved      boolean default true     -- flip to false to hide a review
);
alter table public.reviews enable row level security;

-- Anyone can read approved reviews (to show them on the site).
drop policy if exists "public read approved reviews" on public.reviews;
create policy "public read approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (approved = true);
-- Inserts go through our /api/reviews route (service role), which verifies the
-- reviewer actually has an order — so no public insert policy is needed.

-- 3) Coupons ----------------------------------------------------------------
create table if not exists public.coupons (
  code       text primary key,
  type       text not null default 'percent',  -- 'percent' | 'fixed'
  value      integer not null,                 -- percent (10) or BDT amount (500)
  active     boolean default true,
  min_order  integer default 0,                -- minimum subtotal (BDT)
  expires_at timestamptz
);
alter table public.coupons enable row level security;
-- Validation happens via /api/coupon (service role); no public policy needed.

-- A couple of starter coupons you can edit/delete:
insert into public.coupons (code, type, value, active, min_order) values
  ('WELCOME10', 'percent', 10, true, 0),
  ('EID500',    'fixed',   500, true, 2000)
on conflict (code) do nothing;

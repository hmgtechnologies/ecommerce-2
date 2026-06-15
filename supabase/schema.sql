-- ============================================================================
-- HMG StoreForge — Supabase Schema (FREE tier)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- 1) PRODUCTS TABLE -----------------------------------------------------------
create table if not exists public.products (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  price       numeric not null default 0,
  old_price   numeric,
  category    text default 'General',
  description text default '',
  image_url   text,
  stock       boolean default true,
  featured    boolean default false,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Helpful index for the store's category/active filtering
create index if not exists idx_products_active on public.products(active);
create index if not exists idx_products_category on public.products(category);

-- 2) ORDERS TABLE (optional — store orders submitted from the site) -----------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  customer    text not null,
  phone       text not null,
  address     text,
  note        text,
  items       jsonb not null,
  total       numeric not null,
  pay_method  text,
  status      text default 'pending',
  created_at  timestamptz default now()
);

-- 3) ROW LEVEL SECURITY -------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Anyone (anon key) can READ active products  -> powers the public storefront
drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select
  using (active = true);

-- Anyone can INSERT an order (customers submitting orders). They cannot read others' orders.
drop policy if exists "public insert orders" on public.orders;
create policy "public insert orders"
  on public.orders for insert
  with check (true);

-- ============================================================================
-- WRITING PRODUCTS:
-- For security, product WRITES are NOT allowed via the public anon key.
-- Recommended free options to manage products:
--   (A) Use the Supabase Dashboard Table Editor (easiest, no code).
--   (B) Use the Admin panel in JSON mode (download products.json -> GitHub).
--   (C) Advanced: create an authenticated admin user + a policy below.
--
-- OPTION C — allow logged-in admins to manage products:
-- create policy "admin manage products"
--   on public.products for all
--   using (auth.role() = 'authenticated')
--   with check (auth.role() = 'authenticated');
-- (Then add an admin user in Authentication → Users, and log in from a
--  custom admin build. Keep the anon key public; never expose service_role.)
-- ============================================================================

-- 4) SEED DEMO DATA (optional) ------------------------------------------------
insert into public.products (id,name,price,old_price,category,description,image_url,stock,featured)
values
 ('p1','Sample Ankara Fabric',18000,22000,'Fashion','Premium 6-yard Ankara.','',true,true),
 ('p2','Wireless Earbuds Pro',25000,null,'Electronics','Bluetooth 5.3, 24h battery.','',true,false)
on conflict (id) do nothing;

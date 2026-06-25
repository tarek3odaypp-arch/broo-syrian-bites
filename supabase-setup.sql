-- =====================================================================
-- BROO delivery — Supabase schema setup
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================================
-- NOTE: This app has no end-user authentication (login is mock/role-based
-- via passwords stored in the `settings` table). Because the only key the
-- client uses is the publishable/anon key, RLS policies below allow the
-- `anon` role to read AND write all tables. This is fine for a demo /
-- prototype, but BEFORE going to production you should add Supabase Auth
-- and tighten these policies (e.g. only admins can write to products /
-- categories / settings, only the order owner or driver can update an order).
-- =====================================================================

-- ---------- TABLES ----------
create table if not exists public.restaurants (
  id text primary key,
  name text not null,
  category text not null,
  rating numeric not null default 0,
  delivery_time text not null,
  image text not null,
  tagline text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text not null,
  price numeric not null,
  image text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer text not null,
  phone text not null,
  address text not null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'جديد',
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  from_role text not null check (from_role in ('customer', 'support')),
  text text not null,
  created_at timestamptz not null default now()
);

-- Customer profiles + registration approval workflow (DB-state only, no external OTP).
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  password text not null,
  address text default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- ---------- GRANTS (required for Data API) ----------
grant select, insert, update, delete on public.restaurants    to anon, authenticated;
grant select, insert, update, delete on public.categories     to anon, authenticated;
grant select, insert, update, delete on public.products       to anon, authenticated;
grant select, insert, update, delete on public.orders         to anon, authenticated;
grant select, insert, update, delete on public.settings       to anon, authenticated;
grant select, insert, update, delete on public.chat_messages  to anon, authenticated;
grant select, insert, update, delete on public.profiles       to anon, authenticated;
grant all on public.restaurants, public.categories, public.products,
            public.orders, public.settings, public.chat_messages, public.profiles to service_role;

-- ---------- RLS ----------
alter table public.restaurants   enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.settings      enable row level security;
alter table public.chat_messages enable row level security;
alter table public.profiles      enable row level security;

-- Demo-grade policies: open access to anon (REPLACE before production).
do $$
declare
  t text;
begin
  foreach t in array array['restaurants','categories','products','orders','settings','chat_messages','profiles'] loop
    execute format('drop policy if exists "demo_all_%1$s" on public.%1$s', t);
    execute format(
      'create policy "demo_all_%1$s" on public.%1$s for all to anon, authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;

-- ---------- REALTIME ----------
alter publication supabase_realtime add table public.restaurants;
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.settings;
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.profiles;

-- ---------- SEED DATA ----------
insert into public.restaurants (id,name,category,rating,delivery_time,image,tagline) values
  ('r1','مطعم الشام','شامي',4.8,'25-35 د','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80','أطباق شامية أصيلة'),
  ('r2','بيت البرغر','وجبات سريعة',4.6,'20-30 د','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80','برغر طازج يومياً'),
  ('r3','بيتزا روما','إيطالي',4.7,'30-40 د','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80','بيتزا إيطالية بالحطب'),
  ('r4','حلويات السلطان','حلويات',4.9,'15-25 د','https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80','بقلاوة وكنافة شهية'),
  ('r5','سوبر ماركت النور','بقالة',4.5,'30-45 د','https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80','كل احتياجات منزلك'),
  ('r6','مشاوي أبو علي','مشاوي',4.8,'35-45 د','https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80','مشاوي على الفحم')
on conflict (id) do nothing;

insert into public.categories (id,name,icon) values
  ('c1','وجبات سريعة','UtensilsCrossed'),
  ('c2','إيطالي','Pizza'),
  ('c3','حلويات','IceCream'),
  ('c4','بقالة','ShoppingBasket'),
  ('c5','مشاوي','Flame'),
  ('c6','شامي','Coffee')
on conflict (id) do nothing;

insert into public.products (id,restaurant_id,name,description,price,image) values
  ('p1','r1','شاورما دجاج','خبز صاج مع دجاج متبل وصلصة الثوم',25000,'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&q=80'),
  ('p2','r1','فتة حمص','فتة حمص بالطحينة واللبن والصنوبر',22000,'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80'),
  ('p3','r1','كبة مقلية','كبة لحمة مقرمشة - 4 حبات',30000,'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80'),
  ('p4','r2','برغر لحم كلاسيك','لحم بقري مشوي، جبنة شيدر، خس، طماطم',35000,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80'),
  ('p5','r2','دجاج مقرمش','قطع دجاج مقرمشة مع صلصة خاصة',28000,'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80'),
  ('p6','r3','بيتزا مارغريتا','صلصة طماطم، موزاريلا، ريحان طازج',45000,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80'),
  ('p7','r3','بيتزا بيبروني','صلصة طماطم، جبنة، شرائح بيبروني',50000,'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80'),
  ('p8','r4','كنافة بالجبنة','كنافة ناعمة بالجبنة والقطر',18000,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80'),
  ('p9','r4','بقلاوة فستق','بقلاوة محشوة بالفستق الحلبي',32000,'https://images.unsplash.com/photo-1583243567239-3727b9f3f5fc?w=600&q=80'),
  ('p10','r5','زيت زيتون 1 لتر','زيت زيتون بكر ممتاز',60000,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'),
  ('p11','r5','أرز بسمتي 5 كغ','أرز بسمتي طويل الحبة',75000,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80'),
  ('p12','r6','مشكل مشاوي','كباب، شيش طاووق، ريش، خضار مشوية',95000,'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80')
on conflict (id) do nothing;

insert into public.settings (key, value) values
  ('admin_password',   to_jsonb('admin123'::text)),
  ('driver_password',  to_jsonb('driver123'::text)),
  ('announcements',    '["خصم 25% على أول طلب لك من برو ديليفري","توصيل مجاني للطلبات فوق 100,000 ل.س","اطلب وجبتين واحصل على عصير مجاناً","تطبيق برو الآن في كل المحافظات السورية"]'::jsonb)
on conflict (key) do nothing;

insert into public.chat_messages (from_role, text) values
  ('support','أهلاً بك في دعم BROO! كيف يمكننا مساعدتك؟')
on conflict do nothing;
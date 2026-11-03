-- Jewellbox Club — Supabase schema (run once in SQL Editor)
-- Project: uaifqvhzjzpqiwhriieg

create extension if not exists "pgcrypto";

-- Members / users (OTP login by mobile)
create table if not exists public.members (
  id text primary key,
  name text not null,
  mobile text not null unique,
  email text,
  phone text,
  referral_code text not null default '',
  referred_by text not null default '',
  city text not null default '',
  role text not null check (role in ('member', 'leader', 'admin', 'individual')),
  is_leader boolean not null default false,
  team_size integer not null default 0,
  join_date date not null default (current_date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists members_mobile_idx on public.members (mobile);
create index if not exists members_referral_code_idx on public.members (referral_code);

-- Investments (12-month lock)
create table if not exists public.investments (
  id text primary key,
  user_id text not null references public.members(id) on delete cascade,
  mobile text not null,
  amount numeric not null check (amount > 0),
  date date not null default (current_date),
  locked_until date not null,
  status text not null check (status in ('locked', 'unlocked', 'used')) default 'locked',
  payment_id text,
  created_at timestamptz not null default now()
);

create index if not exists investments_user_id_idx on public.investments (user_id);
create index if not exists investments_mobile_idx on public.investments (mobile);

-- Gold orders
create table if not exists public.gold_orders (
  id text primary key,
  user_id text not null references public.members(id) on delete cascade,
  user_name text not null,
  user_mobile text not null,
  design_id text not null,
  design_name text not null,
  weight_grams numeric not null,
  amount numeric not null,
  status text not null check (status in ('pending', 'confirmed', 'delivered')) default 'pending',
  created_at timestamptz not null default now(),
  investment_ids jsonb not null default '[]'::jsonb
);

create index if not exists gold_orders_user_id_idx on public.gold_orders (user_id);

-- Commission ledger (L1 / L2 / leader / gold)
create table if not exists public.commissions (
  id text primary key,
  user_id text not null references public.members(id) on delete cascade,
  type text not null check (type in ('commission_l1', 'commission_l2', 'leader_payout', 'gold_order_commission')),
  amount numeric not null check (amount >= 0),
  description text not null default '',
  source_user_id text,
  source_investment_id text,
  status text not null check (status in ('completed', 'pending')) default 'completed',
  created_at timestamptz not null default now()
);

create index if not exists commissions_user_id_idx on public.commissions (user_id);
create index if not exists commissions_type_idx on public.commissions (type);
create unique index if not exists commissions_dedupe_idx
  on public.commissions (user_id, type, source_investment_id)
  where source_investment_id is not null;

-- App uses custom 2Factor OTP (not Supabase Auth), so anon key needs CRUD.
alter table public.members enable row level security;
alter table public.investments enable row level security;
alter table public.gold_orders enable row level security;

drop policy if exists "members_anon_all" on public.members;
create policy "members_anon_all" on public.members
  for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "investments_anon_all" on public.investments;
create policy "investments_anon_all" on public.investments
  for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "gold_orders_anon_all" on public.gold_orders;
create policy "gold_orders_anon_all" on public.gold_orders
  for all to anon, authenticated
  using (true) with check (true);

alter table public.commissions enable row level security;
drop policy if exists "commissions_anon_all" on public.commissions;
create policy "commissions_anon_all" on public.commissions
  for all to anon, authenticated
  using (true) with check (true);

-- Seed demo accounts (idempotent)
insert into public.members (id, name, mobile, referral_code, referred_by, city, role, is_leader, team_size, join_date)
values
  ('1', 'Admin User', '9876543210', 'ADMIN001', '', 'Jaipur', 'admin', true, 250, '2023-01-01'),
  ('2', 'Rajesh Kumar', '9876543211', 'RAJ002', '1', 'Delhi', 'leader', true, 120, '2023-03-15'),
  ('3', 'Priya Sharma', '9876543212', 'PRI003', '2', 'Mumbai', 'member', false, 45, '2023-05-20'),
  ('4', 'Amit Patel', '9876543213', '', '', 'Ahmedabad', 'individual', false, 0, '2024-01-15')
on conflict (mobile) do update set
  name = excluded.name,
  role = excluded.role,
  is_leader = excluded.is_leader,
  team_size = excluded.team_size,
  referral_code = excluded.referral_code,
  city = excluded.city;

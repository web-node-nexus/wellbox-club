-- Jewellbox Club — Supabase schema (run once in SQL Editor)
-- Project: ijvjfrffozcyudxdagji

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

-- Gold orders (member + guest direct orders; no FK so guest_* ids work)
create table if not exists public.gold_orders (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_mobile text not null,
  design_id text not null,
  design_name text not null,
  weight_grams numeric not null,
  amount numeric not null default 0,
  status text not null check (status in ('pending', 'confirmed', 'delivered')) default 'pending',
  created_at timestamptz not null default now(),
  investment_ids jsonb not null default '[]'::jsonb
);

create index if not exists gold_orders_user_id_idx on public.gold_orders (user_id);
create index if not exists gold_orders_mobile_idx on public.gold_orders (user_mobile);

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

-- App uses custom 2Factor OTP (not Supabase Auth), so anon/authenticated need CRUD.
alter table public.members enable row level security;
alter table public.investments enable row level security;
alter table public.gold_orders enable row level security;
alter table public.commissions enable row level security;

drop policy if exists "members_anon_all" on public.members;
create policy "members_anon_all" on public.members
  for all to anon, authenticated, public
  using (true) with check (true);

drop policy if exists "investments_anon_all" on public.investments;
create policy "investments_anon_all" on public.investments
  for all to anon, authenticated, public
  using (true) with check (true);

drop policy if exists "gold_orders_anon_all" on public.gold_orders;
create policy "gold_orders_anon_all" on public.gold_orders
  for all to anon, authenticated, public
  using (true) with check (true);

drop policy if exists "commissions_anon_all" on public.commissions;
create policy "commissions_anon_all" on public.commissions
  for all to anon, authenticated, public
  using (true) with check (true);

-- Also grant table access for publishable key role
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- Payout details (also in withdrawals_migration.sql for existing projects)
alter table public.members
  add column if not exists bank_name text not null default '',
  add column if not exists account_number text not null default '',
  add column if not exists ifsc_code text not null default '',
  add column if not exists account_holder text not null default '',
  add column if not exists upi_id text not null default '';

create table if not exists public.withdrawals (
  id text primary key,
  user_id text not null references public.members(id) on delete cascade,
  user_mobile text not null default '',
  amount numeric not null check (amount > 0),
  method text not null check (method in ('bank', 'upi')),
  status text not null check (status in ('pending', 'approved', 'rejected', 'paid')) default 'pending',
  bank_name text not null default '',
  account_number text not null default '',
  ifsc_code text not null default '',
  account_holder text not null default '',
  upi_id text not null default '',
  admin_note text not null default '',
  razorpay_payout_id text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists withdrawals_user_id_idx on public.withdrawals (user_id);
create index if not exists withdrawals_status_idx on public.withdrawals (status);

alter table public.withdrawals enable row level security;
drop policy if exists "withdrawals_anon_all" on public.withdrawals;
create policy "withdrawals_anon_all" on public.withdrawals
  for all to anon, authenticated, public
  using (true) with check (true);
grant all on public.withdrawals to anon, authenticated, service_role;

-- In-app notifications (admin + member)
create table if not exists public.notifications (
  id text primary key,
  audience text not null check (audience in ('admin', 'user')),
  user_id text,
  type text not null,
  title text not null,
  message text not null,
  meta jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_audience_created_idx
  on public.notifications (audience, created_at desc);
create index if not exists notifications_user_id_idx
  on public.notifications (user_id);

alter table public.notifications enable row level security;
drop policy if exists "notifications_anon_all" on public.notifications;
create policy "notifications_anon_all" on public.notifications
  for all to anon, authenticated, public
  using (true) with check (true);
grant all on public.notifications to anon, authenticated, service_role;

-- Web Push subscriptions (payment reminders)
create table if not exists public.push_subscriptions (
  id text primary key,
  user_id text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

create table if not exists public.payment_reminder_log (
  id text primary key,
  user_id text not null,
  due_date date not null,
  slot_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, due_date, slot_key)
);

alter table public.push_subscriptions enable row level security;
alter table public.payment_reminder_log enable row level security;
drop policy if exists "push_subscriptions_anon_all" on public.push_subscriptions;
create policy "push_subscriptions_anon_all" on public.push_subscriptions
  for all to anon, authenticated, public using (true) with check (true);
drop policy if exists "payment_reminder_log_anon_all" on public.payment_reminder_log;
create policy "payment_reminder_log_anon_all" on public.payment_reminder_log
  for all to anon, authenticated, public using (true) with check (true);
grant all on public.push_subscriptions to anon, authenticated, service_role;
grant all on public.payment_reminder_log to anon, authenticated, service_role;

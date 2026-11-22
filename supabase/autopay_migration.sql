-- Autopay / Razorpay Subscriptions (run in Supabase SQL Editor)

create table if not exists public.member_subscriptions (
  id text primary key,
  user_id text not null,
  mobile text not null default '',
  razorpay_subscription_id text not null unique,
  razorpay_plan_id text not null default '',
  amount numeric not null check (amount > 0),
  total_count integer not null default 24,
  paid_count integer not null default 0,
  status text not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_subscriptions_user_id_idx
  on public.member_subscriptions (user_id);
create index if not exists member_subscriptions_mobile_idx
  on public.member_subscriptions (mobile);

-- Dedupe webhook investment credits by Razorpay payment id
create table if not exists public.autopay_payment_log (
  id text primary key,
  razorpay_payment_id text not null unique,
  razorpay_subscription_id text not null,
  user_id text not null,
  amount numeric not null,
  created_at timestamptz not null default now()
);

alter table public.member_subscriptions enable row level security;
alter table public.autopay_payment_log enable row level security;

drop policy if exists "member_subscriptions_anon_all" on public.member_subscriptions;
create policy "member_subscriptions_anon_all" on public.member_subscriptions
  for all to anon, authenticated, public
  using (true) with check (true);

drop policy if exists "autopay_payment_log_anon_all" on public.autopay_payment_log;
create policy "autopay_payment_log_anon_all" on public.autopay_payment_log
  for all to anon, authenticated, public
  using (true) with check (true);

grant all on public.member_subscriptions to anon, authenticated, service_role;
grant all on public.autopay_payment_log to anon, authenticated, service_role;

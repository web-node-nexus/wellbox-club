-- Run in Supabase SQL Editor (after schema.sql)
-- Payout details on members + withdrawals ledger

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

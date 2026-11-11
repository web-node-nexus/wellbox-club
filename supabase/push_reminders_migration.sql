-- Push subscriptions + payment reminder dedupe (run in Supabase SQL Editor)

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

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);

create table if not exists public.payment_reminder_log (
  id text primary key,
  user_id text not null,
  due_date date not null,
  slot_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, due_date, slot_key)
);

create index if not exists payment_reminder_log_user_idx
  on public.payment_reminder_log (user_id, due_date);

alter table public.push_subscriptions enable row level security;
alter table public.payment_reminder_log enable row level security;

drop policy if exists "push_subscriptions_anon_all" on public.push_subscriptions;
create policy "push_subscriptions_anon_all" on public.push_subscriptions
  for all to anon, authenticated, public
  using (true) with check (true);

drop policy if exists "payment_reminder_log_anon_all" on public.payment_reminder_log;
create policy "payment_reminder_log_anon_all" on public.payment_reminder_log
  for all to anon, authenticated, public
  using (true) with check (true);

grant all on public.push_subscriptions to anon, authenticated, service_role;
grant all on public.payment_reminder_log to anon, authenticated, service_role;

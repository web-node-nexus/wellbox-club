-- Admin / member in-app notifications (run in Supabase SQL Editor)

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
create index if not exists notifications_unread_admin_idx
  on public.notifications (audience, read)
  where audience = 'admin' and read = false;

alter table public.notifications enable row level security;
drop policy if exists "notifications_anon_all" on public.notifications;
create policy "notifications_anon_all" on public.notifications
  for all to anon, authenticated, public
  using (true) with check (true);

grant all on public.notifications to anon, authenticated, service_role;

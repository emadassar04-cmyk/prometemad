-- Newsletter capture: public signup (footer form), admin-only read/send.
-- Actual sending is wired in the app layer (Resend) but stays inert until
-- RESEND_API_KEY is configured — this migration only sets up storage.
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null default 'ar',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.subscribers enable row level security;

create policy "anyone can subscribe"
  on public.subscribers for insert
  with check (true);

create policy "only admins can view subscribers"
  on public.subscribers for select
  using (is_admin());

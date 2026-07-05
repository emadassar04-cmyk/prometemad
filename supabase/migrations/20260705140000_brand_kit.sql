-- Phase 3 of the platform plan: Brand Kit. One kit per user (saved once,
-- reused across generations), hence user_id as the primary key rather than
-- a separate surrogate id — mirrors the profiles table's pattern.
create table if not exists public.brand_kits (
  user_id uuid primary key references auth.users (id) on delete cascade,
  business_name text,
  logo_url text,
  colors jsonb not null default '[]'::jsonb, -- array of hex strings, e.g. ["#D4AF37", "#1E3A5F"]
  font text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brand_kits enable row level security;

create policy "users read own brand kit"
  on public.brand_kits for select
  using (auth.uid() = user_id);

create policy "users insert own brand kit"
  on public.brand_kits for insert
  with check (auth.uid() = user_id);

create policy "users update own brand kit"
  on public.brand_kits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users delete own brand kit"
  on public.brand_kits for delete
  using (auth.uid() = user_id);

-- storage: public-read bucket for uploaded brand logos, scoped so a user
-- may only write into their own folder (same convention as the aborted
-- photo-upload attempt's storage policy).
insert into storage.buckets (id, name, public)
values ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

create policy "users upload their own brand logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users update their own brand logo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'brand-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

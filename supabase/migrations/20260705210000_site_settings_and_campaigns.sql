-- Admin dashboard Phase 6: editable marketing copy + seasonal campaigns.
create table if not exists public.site_settings (
  key text primary key,
  value_ar text,
  value_en text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "site settings are publicly readable"
  on public.site_settings for select
  using (true);

create policy "only admins can write site settings"
  on public.site_settings for insert
  with check (is_admin());

create policy "only admins can update site settings"
  on public.site_settings for update
  using (is_admin());

-- Seed with the current static copy so the admin form starts pre-filled
-- instead of blank, and nothing changes on the live site until edited.
insert into public.site_settings (key, value_ar, value_en) values
  ('hero_badge', 'منصة عربية لتوليد الصور بالبرومبتات الجاهزة', 'The Arabic platform for ready-made image prompts'),
  ('hero_title', 'ابحث عن البرومبت، خصّصه، وولّد صورتك في أقل من دقيقتين', 'Find a prompt, customize it, generate your image in under two minutes'),
  ('hero_subtitle', 'مكتبة برومبتات صور مصنّفة لصنّاع المحتوى والمسوّقين العرب — كل برومبت معه نتيجة حقيقية', 'A curated image prompt library for Arab creators and marketers — every prompt comes with a real result'),
  ('seo_title', 'برومبتلي', 'Promptly'),
  ('seo_description', 'برومبتات صور احترافية بالعربية… ونتيجة حقيقية بضغطة واحدة', 'Professional image prompts in Arabic… a real result in one click')
on conflict (key) do nothing;

-- Seasonal campaigns: an active one surfaces a homepage banner linking to
-- its associated category.
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  category_id uuid references public.categories(id) on delete set null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

create policy "campaigns are publicly readable"
  on public.campaigns for select
  using (true);

create policy "only admins can write campaigns"
  on public.campaigns for insert
  with check (is_admin());

create policy "only admins can update campaigns"
  on public.campaigns for update
  using (is_admin());

create policy "only admins can delete campaigns"
  on public.campaigns for delete
  using (is_admin());

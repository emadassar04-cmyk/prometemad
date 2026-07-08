-- "الصور الشخصية" (Personal Photos): identity-preserving photo styling.
-- Users upload a selfie, pick a style, and get it regenerated with their
-- own face preserved. Styles are admin-managed content (like prompts);
-- generations are per-user records pointing at a private storage bucket.

create table if not exists public.personal_styles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text not null,
  tagline_ar text not null,
  prompt_body text not null,
  share_text_ar text not null,
  category text not null check (category in ('professional', 'cinematic', 'heritage', 'art', 'fun')),
  example_before_url text,
  example_after_url text,
  usage_count integer not null default 0,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.personal_styles enable row level security;

create policy "active styles are publicly readable"
  on public.personal_styles for select
  using (is_active = true);

create policy "admins can read all styles"
  on public.personal_styles for select
  using (is_admin());

create policy "admins can write styles"
  on public.personal_styles for all
  using (is_admin())
  with check (is_admin());

-- Counter bump for the "استُخدم N مرة" social-proof line — same
-- security-definer pattern as increment_prompt_generation_count, so any
-- signed-in caller can bump it without needing a write policy on the row.
create or replace function public.increment_personal_style_usage(p_style_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.personal_styles set usage_count = usage_count + 1 where id = p_style_id;
$$;

grant execute on function public.increment_personal_style_usage(uuid) to authenticated;

create table if not exists public.personal_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  style_id uuid not null references public.personal_styles (id) on delete cascade,
  source_image_path text not null,
  result_image_path text,
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.personal_generations enable row level security;

create policy "users can read own personal generations"
  on public.personal_generations for select
  using (auth.uid() = user_id);

create policy "users can insert own personal generations"
  on public.personal_generations for insert
  with check (auth.uid() = user_id);

-- Only status/result_image_path ever need updating after the initial
-- insert (by the server route polling/writing the generation outcome),
-- scoped to the owning user same as the other policies here.
create policy "users can update own personal generations"
  on public.personal_generations for update
  using (auth.uid() = user_id);

create policy "admins can read all personal generations"
  on public.personal_generations for select
  using (is_admin());

-- Private bucket: reads must go through signed URLs / the owning user's
-- own session, unlike the public 'generations'/'prompt-previews' buckets.
insert into storage.buckets (id, name, public)
values ('personal-photos', 'personal-photos', false)
on conflict (id) do nothing;

create policy "users can read own personal photos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'personal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can upload own personal photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'personal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can delete own personal photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'personal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

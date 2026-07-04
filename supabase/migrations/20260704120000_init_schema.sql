-- Promptly-AR initial schema: profiles, categories, prompts, generations, favorites, daily_usage
-- All tables have RLS enabled. Public read is limited to published content.

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  locale text not null default 'ar',
  role text not null default 'user' check (role in ('user', 'admin')),
  plan text not null default 'free',
  credits integer not null default 10,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- prevent non-service callers from self-elevating role/plan/credits;
-- those fields are only meant to change via the service role (admin tools,
-- billing webhooks) which bypasses RLS entirely but still runs this trigger.
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.role() <> 'service_role' then
    new.role := old.role;
    new.plan := old.plan;
    new.credits := old.credits;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_columns on public.profiles;
create trigger protect_profile_privileged_columns
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

-- create profile row automatically when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(new.raw_user_meta_data ->> 'locale', 'ar')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- categories
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  icon text,
  sort_order integer not null default 0
);

alter table public.categories enable row level security;

create policy "categories are publicly readable"
  on public.categories for select
  using (true);

-- ============================================================
-- prompts
-- ============================================================
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  prompt_text_en text not null,
  prompt_display_ar text not null,
  variables jsonb not null default '[]'::jsonb,
  category_id uuid references public.categories (id) on delete set null,
  style text,
  model text,
  tags text[] not null default '{}',
  preview_image_url text,
  is_featured boolean not null default false,
  copy_count integer not null default 0,
  generation_count integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  search_vector_en tsvector generated always as (
    to_tsvector('english', coalesce(title_en, '') || ' ' || coalesce(description_en, '') || ' ' || coalesce(prompt_text_en, ''))
  ) stored,
  search_vector_ar tsvector generated always as (
    to_tsvector('arabic', coalesce(title_ar, '') || ' ' || coalesce(description_ar, '') || ' ' || coalesce(prompt_display_ar, ''))
  ) stored
);

create index if not exists prompts_tags_gin_idx on public.prompts using gin (tags);
create index if not exists prompts_search_en_gin_idx on public.prompts using gin (search_vector_en);
create index if not exists prompts_search_ar_gin_idx on public.prompts using gin (search_vector_ar);
create index if not exists prompts_category_id_idx on public.prompts (category_id);
create index if not exists prompts_status_idx on public.prompts (status);

alter table public.prompts enable row level security;

create policy "published prompts are publicly readable"
  on public.prompts for select
  using (status = 'published' or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "only admins can write prompts"
  on public.prompts for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "only admins can update prompts"
  on public.prompts for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "only admins can delete prompts"
  on public.prompts for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================================
-- generations
-- ============================================================
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt_id uuid references public.prompts (id) on delete set null,
  final_prompt text not null,
  image_url text,
  provider text,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists generations_user_id_idx on public.generations (user_id, created_at desc);

alter table public.generations enable row level security;

create policy "users read own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "users insert own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "users update own generations"
  on public.generations for update
  using (auth.uid() = user_id);

-- ============================================================
-- favorites
-- ============================================================
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt_id uuid not null references public.prompts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

alter table public.favorites enable row level security;

create policy "users manage own favorites select"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "users manage own favorites insert"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "users manage own favorites delete"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ============================================================
-- daily_usage (server-enforced quota bookkeeping)
-- ============================================================
create table if not exists public.daily_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  generations_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.daily_usage enable row level security;

-- users may only read their own quota row; writes happen exclusively via the
-- service role (API route / n8n) so the client cannot forge its own counter.
create policy "users read own daily usage"
  on public.daily_usage for select
  using (auth.uid() = user_id);

-- ============================================================
-- helper: atomic quota check+increment, callable via RPC by the
-- generation API route using the user's own JWT (security definer keeps
-- daily_usage writes server-controlled without needing the service key).
-- ============================================================
create or replace function public.try_increment_daily_usage(p_user_id uuid, p_daily_limit integer default 10)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  current_count integer;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  insert into public.daily_usage (user_id, usage_date, generations_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select generations_count into current_count
  from public.daily_usage
  where user_id = p_user_id and usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return false;
  end if;

  update public.daily_usage
  set generations_count = generations_count + 1
  where user_id = p_user_id and usage_date = current_date;

  return true;
end;
$$;

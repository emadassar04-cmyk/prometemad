-- Rest of Phase 6: showcase gallery, social proof (total generation count +
-- star ratings). Phase 5 (credits/pricing) is explicitly deferred.

-- Showcase: users opt a specific generation into a public gallery.
alter table public.generations
  add column if not exists is_public boolean not null default false;

-- Additive to the existing owner-only select policy (RLS policies for the
-- same command are OR'd), so a row is visible if you own it OR it's a
-- shared, succeeded generation.
create policy "public can read shared generations"
  on public.generations for select
  using (status = 'succeeded' and is_public = true);

-- "X images generated" counter needs to bypass per-user RLS to aggregate
-- across everyone, but must only ever return a count — no row data leaks.
create or replace function public.get_total_generation_count()
returns bigint
language sql
security definer set search_path = public
stable
as $$
  select count(*) from public.generations where status = 'succeeded';
$$;

-- Star ratings, one per user per prompt.
create table if not exists public.prompt_ratings (
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt_id uuid not null references public.prompts (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

alter table public.prompt_ratings enable row level security;

create policy "ratings are publicly readable"
  on public.prompt_ratings for select
  using (true);

create policy "users insert own rating"
  on public.prompt_ratings for insert
  with check (auth.uid() = user_id);

create policy "users update own rating"
  on public.prompt_ratings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

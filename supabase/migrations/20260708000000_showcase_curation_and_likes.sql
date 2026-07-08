-- Community gallery upgrade: admin can directly feature any succeeded
-- generation in the showcase (not just approve user submissions), and
-- anonymous visitors can like showcased images.

alter table public.generations
  add column if not exists is_curated boolean not null default false;

-- Same protection as is_public/moderation_status: a non-admin caller can't
-- set is_curated on their own row.
create or replace function public.protect_generation_moderation_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    new.is_public := old.is_public;
    new.is_curated := old.is_curated;
    if new.moderation_status not in ('none', 'pending') then
      new.moderation_status := old.moderation_status;
    end if;
  end if;
  return new;
end;
$$;

-- Showcase now shows anything the user opted in AND had approved, OR
-- anything the admin curated directly regardless of submission.
drop policy if exists "public can read shared generations" on public.generations;
create policy "public can read shared generations"
  on public.generations for select
  using (status = 'succeeded' and (is_public = true or is_curated = true));

-- Anonymous likes on showcased images.
alter table public.generations
  add column if not exists like_count integer not null default 0 check (like_count >= 0);

create table if not exists public.generation_likes (
  generation_id uuid not null references public.generations (id) on delete cascade,
  anon_id text not null,
  created_at timestamptz not null default now(),
  primary key (generation_id, anon_id)
);

alter table public.generation_likes enable row level security;
-- no direct public policies: all access goes through the security-definer
-- RPC below, same pattern as rate_limit_windows.

-- Toggles a like for (generation_id, anon_id): inserts+increments if absent,
-- deletes+decrements if present. Runs as security definer since anonymous
-- visitors have no auth.uid() to satisfy a normal RLS check.
create or replace function public.toggle_generation_like(
  p_generation_id uuid,
  p_anon_id text
)
returns table (liked boolean, like_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing boolean;
begin
  -- RETURNS TABLE(..., like_count integer) implicitly declares a PL/pgSQL
  -- variable named like_count, so every reference to the column below must
  -- be qualified with a table alias or it resolves to that variable instead.
  select exists (
    select 1 from public.generation_likes gl
    where gl.generation_id = p_generation_id and gl.anon_id = p_anon_id
  ) into v_existing;

  if v_existing then
    delete from public.generation_likes gl
    where gl.generation_id = p_generation_id and gl.anon_id = p_anon_id;

    update public.generations g
    set like_count = greatest(g.like_count - 1, 0)
    where g.id = p_generation_id;
  else
    insert into public.generation_likes (generation_id, anon_id)
    values (p_generation_id, p_anon_id);

    update public.generations g
    set like_count = g.like_count + 1
    where g.id = p_generation_id;
  end if;

  return query
    select not v_existing, g.like_count from public.generations g where g.id = p_generation_id;
end;
$$;

-- Generic per-key request throttle for anonymous endpoints (mirrors
-- rate_limit_windows, which is keyed by user_id and can't be used here
-- since likers aren't authenticated). Keyed by a caller-supplied string
-- (e.g. client IP) rather than a user id.
create table if not exists public.anon_rate_limit_windows (
  rate_key text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  primary key (rate_key, window_start)
);

alter table public.anon_rate_limit_windows enable row level security;
-- no public policies: only ever touched through the RPC below.

create or replace function public.try_increment_anon_rate_limit(
  p_key text,
  p_max_requests integer default 20,
  p_window_seconds integer default 60
)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  current_window timestamptz;
  current_count integer;
begin
  current_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  insert into public.anon_rate_limit_windows (rate_key, window_start, request_count)
  values (p_key, current_window, 0)
  on conflict (rate_key, window_start) do nothing;

  select request_count into current_count
  from public.anon_rate_limit_windows
  where rate_key = p_key and window_start = current_window
  for update;

  if current_count >= p_max_requests then
    return false;
  end if;

  update public.anon_rate_limit_windows
  set request_count = request_count + 1
  where rate_key = p_key and window_start = current_window;

  return true;
end;
$$;

grant execute on function public.toggle_generation_like(uuid, text) to anon, authenticated;
grant execute on function public.try_increment_anon_rate_limit(text, integer, integer) to anon, authenticated;

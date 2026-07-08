-- Personal Photos generations call a paid, identity-preserving image model
-- (unlike the free-provider /api/generate flow), so they get their own,
-- much stricter daily quota rather than sharing daily_usage's higher limit.
create table if not exists public.personal_photos_daily_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  generations_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.personal_photos_daily_usage enable row level security;

create policy "users read own personal photos daily usage"
  on public.personal_photos_daily_usage for select
  using (auth.uid() = user_id);

create or replace function public.try_increment_personal_photos_daily_usage(
  p_user_id uuid,
  p_daily_limit integer default 3
)
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

  insert into public.personal_photos_daily_usage (user_id, usage_date, generations_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select generations_count into current_count
  from public.personal_photos_daily_usage
  where user_id = p_user_id and usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return false;
  end if;

  update public.personal_photos_daily_usage
  set generations_count = generations_count + 1
  where user_id = p_user_id and usage_date = current_date;

  return true;
end;
$$;

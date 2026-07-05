-- Phase 2 of the platform plan: AI prompt enhancer. Gets its own daily
-- quota (higher than image generation, since it's a cheap text call) using
-- the same atomic fixed-window pattern as try_increment_daily_usage.
create table if not exists public.enhance_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  enhance_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.enhance_usage enable row level security;

create policy "users read own enhance usage"
  on public.enhance_usage for select
  using (auth.uid() = user_id);

create or replace function public.try_increment_enhance_usage(p_user_id uuid, p_daily_limit integer default 20)
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

  insert into public.enhance_usage (user_id, usage_date, enhance_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select enhance_count into current_count
  from public.enhance_usage
  where user_id = p_user_id and usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return false;
  end if;

  update public.enhance_usage
  set enhance_count = enhance_count + 1
  where user_id = p_user_id and usage_date = current_date;

  return true;
end;
$$;

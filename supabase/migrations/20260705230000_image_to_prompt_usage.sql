-- New flagship differentiator feature: upload any image, get a usable
-- ar/en prompt back. Own daily quota, same atomic fixed-window pattern as
-- enhance_usage/daily_usage.
create table if not exists public.image_to_prompt_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  usage_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.image_to_prompt_usage enable row level security;

create policy "users read own image-to-prompt usage"
  on public.image_to_prompt_usage for select
  using (auth.uid() = user_id);

create or replace function public.try_increment_image_to_prompt_usage(
  p_user_id uuid, p_daily_limit integer default 15
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

  insert into public.image_to_prompt_usage (user_id, usage_date, usage_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select usage_count into current_count
  from public.image_to_prompt_usage
  where user_id = p_user_id and usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return false;
  end if;

  update public.image_to_prompt_usage
  set usage_count = usage_count + 1
  where user_id = p_user_id and usage_date = current_date;

  return true;
end;
$$;

-- Per-minute request throttle for /api/generate, on top of the existing
-- daily quota. The daily cap controls cost; this guards against a burst of
-- rapid-fire requests (scripted abuse, accidental double-clicks at scale)
-- hammering the endpoint and the downstream n8n webhook.
create table if not exists public.rate_limit_windows (
  user_id uuid not null references auth.users (id) on delete cascade,
  window_start timestamptz not null,
  request_count integer not null default 0,
  primary key (user_id, window_start)
);

alter table public.rate_limit_windows enable row level security;

-- no public policies: this table is only ever touched through the
-- security-definer RPC below, same pattern as daily_usage/try_increment_daily_usage.

create or replace function public.try_increment_rate_limit(
  p_user_id uuid,
  p_max_requests integer default 5,
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
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  current_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  insert into public.rate_limit_windows (user_id, window_start, request_count)
  values (p_user_id, current_window, 0)
  on conflict (user_id, window_start) do nothing;

  select request_count into current_count
  from public.rate_limit_windows
  where user_id = p_user_id and window_start = current_window
  for update;

  if current_count >= p_max_requests then
    return false;
  end if;

  update public.rate_limit_windows
  set request_count = request_count + 1
  where user_id = p_user_id and window_start = current_window;

  return true;
end;
$$;

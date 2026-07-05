-- Referral system: every profile gets a short unique code; redeeming
-- someone else's code once (on first login after signup) grants both the
-- referrer and the new user a permanent bump to their daily image quota.

alter table public.profiles
  add column if not exists referral_code text
    default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

-- Backfill is handled by the volatile column default above (each existing
-- row gets its own distinct code at ALTER TABLE time), so no UPDATE needed.
alter table public.profiles
  alter column referral_code set not null;

create unique index if not exists profiles_referral_code_key
  on public.profiles (referral_code);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  referred_id uuid not null unique references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.referrals enable row level security;

create policy "referrer can view own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id);

-- protect_profile_privileged_columns (see 20260705190000) reverts
-- daily_limit_override on any UPDATE unless the caller is already an admin
-- — which would silently swallow the referral bonus, since redeem_referral
-- is called by the newly-referred (non-admin) user's own session. This
-- transaction-local flag lets redeem_referral's own writes through without
-- weakening the trigger for anything else. Not exploitable from the API:
-- set_config isn't a function PostgREST exposes to clients.
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_caller_admin boolean;
begin
  select exists(
    select 1 from profiles where id = auth.uid() and role = 'admin'
  ) into is_caller_admin;

  if not is_caller_admin
     and coalesce(current_setting('promptly.trusted_write', true), 'false') <> 'true' then
    new.role := old.role;
    new.is_banned := old.is_banned;
    new.daily_limit_override := old.daily_limit_override;
    new.credits := old.credits;
  end if;

  return new;
end;
$$;

create or replace function public.redeem_referral(p_referral_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referrer_id uuid;
  v_bonus constant integer := 5;
  v_default_limit constant integer := 10;
begin
  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  select id into v_referrer_id
  from profiles
  where referral_code = upper(trim(p_referral_code));

  if v_referrer_id is null or v_referrer_id = auth.uid() then
    return false;
  end if;

  if exists (select 1 from referrals where referred_id = auth.uid()) then
    return false;
  end if;

  insert into referrals (referrer_id, referred_id) values (v_referrer_id, auth.uid());

  perform set_config('promptly.trusted_write', 'true', true);

  update profiles
  set daily_limit_override = coalesce(daily_limit_override, v_default_limit) + v_bonus
  where id = v_referrer_id;

  update profiles
  set daily_limit_override = coalesce(daily_limit_override, v_default_limit) + v_bonus
  where id = auth.uid();

  perform set_config('promptly.trusted_write', 'false', true);

  return true;
end;
$$;

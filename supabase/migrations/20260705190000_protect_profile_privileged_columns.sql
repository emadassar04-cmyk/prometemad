-- CRITICAL FIX: "profiles are updatable by owner" (auth.uid() = id) has no
-- column-level restriction, so any signed-in user could currently call
-- `.from("profiles").update({ role: "admin" }).eq("id", myId)` directly and
-- grant themselves admin. RLS can't compare OLD vs NEW columns in a single
-- policy, so this closes it with a trigger that reverts privileged columns
-- to their previous value unless the caller is already an admin.
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

  if not is_caller_admin then
    new.role := old.role;
    new.is_banned := old.is_banned;
    new.daily_limit_override := old.daily_limit_override;
    new.credits := old.credits;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_columns on public.profiles;
create trigger protect_profile_privileged_columns
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

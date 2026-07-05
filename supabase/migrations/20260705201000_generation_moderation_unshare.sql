-- Refine protect_generation_moderation_columns(): a user should still be
-- able to un-share their own already-approved post without admin
-- involvement (self-service take-down), even though they can never flip
-- is_public false->true themselves. Un-sharing also resets
-- moderation_status back to 'none' so a future re-share goes through
-- review again rather than silently reusing the old approval.
create or replace function public.protect_generation_moderation_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    if old.is_public = true and new.is_public = false then
      new.moderation_status := 'none';
    else
      new.is_public := old.is_public;
      if new.moderation_status not in ('none', 'pending') then
        new.moderation_status := old.moderation_status;
      end if;
    end if;
  end if;
  return new;
end;
$$;

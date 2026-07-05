-- Admin dashboard Phase 4: showcase moderation. Previously "share to
-- showcase" set is_public=true directly and it appeared immediately; now
-- it only submits for review — is_public only becomes true once an admin
-- approves it.
alter table public.generations
  add column if not exists moderation_status text not null default 'none'
    check (moderation_status in ('none', 'pending', 'approved', 'rejected'));

-- Grandfather in anything already public under the old self-serve model —
-- don't retroactively hide content that was already live.
update public.generations set moderation_status = 'approved' where is_public = true;

-- "users update own generations" has no column-level restriction (same gap
-- as profiles before it), so a user could otherwise set is_public=true
-- directly themselves. A non-admin caller may only move moderation_status
-- between 'none' and 'pending' (submit/withdraw); is_public and
-- approved/rejected stay admin-only.
create or replace function public.protect_generation_moderation_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    new.is_public := old.is_public;
    if new.moderation_status not in ('none', 'pending') then
      new.moderation_status := old.moderation_status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_generation_moderation_columns on public.generations;
create trigger protect_generation_moderation_columns
  before update on public.generations
  for each row execute function public.protect_generation_moderation_columns();

-- Admin needs to see and act on every user's pending submissions, not just
-- their own rows.
create policy "admins can read all generations"
  on public.generations for select
  using (is_admin());

create policy "admins can update any generation"
  on public.generations for update
  using (is_admin());

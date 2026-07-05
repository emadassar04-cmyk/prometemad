-- Fix: the two new self-referential profiles policies (each doing an inline
-- `exists (select 1 from profiles where ...)` against their own table)
-- caused Postgres to detect infinite recursion in policy expansion the
-- moment BOTH a self-referential SELECT and a self-referential UPDATE
-- policy exist together and a non-admin's UPDATE needs to evaluate them.
-- A SECURITY DEFINER function breaks the cycle: RLS doesn't apply inside a
-- definer function owned by a bypassing role, so calling is_admin() from a
-- policy doesn't re-trigger the same policy's own expansion the way an
-- inline subquery does.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "admins can read all profiles" on public.profiles;
create policy "admins can read all profiles"
  on public.profiles for select
  using (is_admin());

drop policy if exists "admins can update any profile" on public.profiles;
create policy "admins can update any profile"
  on public.profiles for update
  using (is_admin());

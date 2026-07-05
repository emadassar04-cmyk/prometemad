-- Admin dashboard Phase 3: user management.
alter table public.profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists daily_limit_override integer;

-- profiles previously had no admin visibility at all (only "owner reads/
-- updates own row"), so an admin couldn't see or edit anyone else's profile.
-- OR'd additively onto the existing owner policies for the same command.
create policy "admins can read all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins can update any profile"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Lists every user with their email (only readable via auth.users, which
-- normal clients can't query directly) plus lifetime/today generation
-- counts, for the admin users table. Security definer + internal admin
-- check, same pattern as admin_dashboard_stats().
create or replace function public.admin_list_users()
returns json
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
    raise exception 'not authorized';
  end if;

  return coalesce((
    select json_agg(t) from (
      select
        u.id,
        u.email,
        u.created_at,
        u.last_sign_in_at,
        p.role,
        p.is_banned,
        p.daily_limit_override,
        (select count(*) from generations g where g.user_id = u.id) as total_generations,
        coalesce(
          (select du.generations_count from daily_usage du
           where du.user_id = u.id and du.usage_date = current_date),
          0
        ) as generations_today
      from auth.users u
      join profiles p on p.id = u.id
      order by u.created_at desc
    ) t
  ), '[]'::json);
end;
$$;

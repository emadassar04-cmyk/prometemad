-- Team workspaces: a user requests a workspace, an admin approves it, then
-- members join via an invite code and pool their daily generation quota
-- into one shared budget instead of each having a separate cap.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  invite_code text not null default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create unique index if not exists workspaces_invite_code_key on public.workspaces (invite_code);

alter table public.workspaces enable row level security;

-- A user can belong to at most one workspace — keeps quota pooling
-- unambiguous (which single pool does this user's generation draw from).
create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id),
  unique (user_id)
);

alter table public.workspace_members enable row level security;

-- SECURITY DEFINER so RLS policies that call it don't recurse into
-- workspace_members' own policy expansion (same reasoning as is_admin()).
create or replace function public.current_workspace_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select workspace_id from public.workspace_members where user_id = auth.uid() limit 1;
$$;

create policy "owner can read own workspace"
  on public.workspaces for select
  using (auth.uid() = owner_id);

create policy "members can read their workspace"
  on public.workspaces for select
  using (id = current_workspace_id());

create policy "admins can read all workspaces"
  on public.workspaces for select
  using (is_admin());

create policy "members can read their workspace roster"
  on public.workspace_members for select
  using (workspace_id = current_workspace_id());

create policy "admins can read all workspace members"
  on public.workspace_members for select
  using (is_admin());

-- Shared daily quota bookkeeping, one row per workspace per day — mirrors
-- daily_usage but keyed by workspace instead of user.
create table if not exists public.workspace_daily_usage (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  usage_date date not null default current_date,
  generations_count integer not null default 0,
  primary key (workspace_id, usage_date)
);

alter table public.workspace_daily_usage enable row level security;

create policy "members can read their workspace usage"
  on public.workspace_daily_usage for select
  using (workspace_id = current_workspace_id());

-- All writes below happen exclusively through these SECURITY DEFINER RPCs
-- (no direct insert/update/delete policies exist on any of the three
-- tables), same lockdown pattern as the moderation columns.

create or replace function public.request_workspace(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workspace_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  if exists (select 1 from public.workspace_members where user_id = auth.uid()) then
    raise exception 'already_in_workspace';
  end if;

  if exists (select 1 from public.workspaces where owner_id = auth.uid() and status = 'pending') then
    raise exception 'request_already_pending';
  end if;

  insert into public.workspaces (name, owner_id, status)
  values (trim(p_name), auth.uid(), 'pending')
  returning id into v_workspace_id;

  return v_workspace_id;
end;
$$;

create or replace function public.approve_workspace(p_workspace_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select owner_id into v_owner_id
  from public.workspaces
  where id = p_workspace_id and status = 'pending';

  if v_owner_id is null then
    return false;
  end if;

  update public.workspaces
  set status = 'approved', decided_at = now()
  where id = p_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (p_workspace_id, v_owner_id, 'owner')
  on conflict (user_id) do nothing;

  return true;
end;
$$;

create or replace function public.reject_workspace(p_workspace_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  update public.workspaces
  set status = 'rejected', decided_at = now()
  where id = p_workspace_id and status = 'pending';

  return found;
end;
$$;

create or replace function public.join_workspace(p_invite_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workspace_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  if exists (select 1 from public.workspace_members where user_id = auth.uid()) then
    return false;
  end if;

  select id into v_workspace_id
  from public.workspaces
  where invite_code = upper(trim(p_invite_code)) and status = 'approved';

  if v_workspace_id is null then
    return false;
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, auth.uid(), 'member');

  return true;
end;
$$;

create or replace function public.leave_workspace()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  delete from public.workspace_members
  where user_id = auth.uid() and role = 'member';

  return found;
end;
$$;

-- Extends the existing per-user quota check: a workspace member's
-- generations draw from one shared pool (sized as the sum of every
-- member's individual daily limit) instead of their own daily_usage row.
-- Falls through to the original per-user behavior unchanged for anyone
-- not in an approved workspace.
create or replace function public.try_increment_daily_usage(p_user_id uuid, p_daily_limit integer default 10)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  current_count integer;
  v_workspace_id uuid;
  v_pooled_limit integer;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  select wm.workspace_id into v_workspace_id
  from public.workspace_members wm
  join public.workspaces w on w.id = wm.workspace_id
  where wm.user_id = p_user_id and w.status = 'approved';

  if v_workspace_id is not null then
    select coalesce(sum(coalesce(pr.daily_limit_override, 10)), 0) into v_pooled_limit
    from public.workspace_members wm2
    join public.profiles pr on pr.id = wm2.user_id
    where wm2.workspace_id = v_workspace_id;

    insert into public.workspace_daily_usage (workspace_id, usage_date, generations_count)
    values (v_workspace_id, current_date, 0)
    on conflict (workspace_id, usage_date) do nothing;

    select wdu.generations_count into current_count
    from public.workspace_daily_usage wdu
    where wdu.workspace_id = v_workspace_id and wdu.usage_date = current_date
    for update;

    if current_count >= v_pooled_limit then
      return false;
    end if;

    update public.workspace_daily_usage wdu
    set generations_count = wdu.generations_count + 1
    where wdu.workspace_id = v_workspace_id and wdu.usage_date = current_date;

    return true;
  end if;

  insert into public.daily_usage (user_id, usage_date, generations_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select du.generations_count into current_count
  from public.daily_usage du
  where du.user_id = p_user_id and du.usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return false;
  end if;

  update public.daily_usage du
  set generations_count = du.generations_count + 1
  where du.user_id = p_user_id and du.usage_date = current_date;

  return true;
end;
$$;

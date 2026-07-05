-- Aggregates the admin dashboard's overview numbers across ALL users in one
-- call. Needs security definer because the caller's own RLS view of
-- `generations` is scoped to their own rows (+ publicly-shared ones) — an
-- admin querying it directly, as the previous getAdminStats() did, would
-- silently undercount to just their own generations. Guards itself with an
-- explicit admin check rather than relying solely on callers remembering to
-- gate access.
create or replace function public.admin_dashboard_stats()
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

  return json_build_object(
    'total_prompts', (select count(*) from prompts),
    'total_generations', (select count(*) from generations),
    'total_users', (select count(*) from profiles),
    'daily_generations', (
      select coalesce(json_agg(t), '[]'::json) from (
        select
          to_char(d::date, 'YYYY-MM-DD') as day,
          (select count(*) from generations g where g.created_at::date = d::date) as count
        from generate_series(now()::date - interval '29 days', now()::date, interval '1 day') d
      ) t
    ),
    'top_prompts', (
      select coalesce(json_agg(t), '[]'::json) from (
        select id, title_ar, title_en, generation_count
        from prompts
        order by generation_count desc nulls last
        limit 10
      ) t
    ),
    'top_categories', (
      select coalesce(json_agg(t), '[]'::json) from (
        select
          c.name_ar,
          c.name_en,
          coalesce(sum(p.generation_count), 0) as total_generations
        from categories c
        left join prompts p on p.category_id = c.id
        group by c.id, c.name_ar, c.name_en
        order by total_generations desc
        limit 10
      ) t
    )
  );
end;
$$;

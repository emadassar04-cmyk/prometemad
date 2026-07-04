create or replace function public.increment_prompt_generation_count(p_prompt_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.prompts
  set generation_count = generation_count + 1
  where id = p_prompt_id;
end;
$$;

revoke execute on function public.increment_prompt_generation_count(uuid) from public, anon;
grant execute on function public.increment_prompt_generation_count(uuid) to authenticated;

create or replace function public.increment_prompt_copy_count(p_prompt_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.prompts
  set copy_count = copy_count + 1
  where id = p_prompt_id;
end;
$$;

revoke execute on function public.increment_prompt_copy_count(uuid) from public, anon;
grant execute on function public.increment_prompt_copy_count(uuid) to authenticated;

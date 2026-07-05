-- Admin dashboard Phase 7: technical health/logs. generations.status only
-- ever said 'failed' with no reason — add a column to capture why.
alter table public.generations
  add column if not exists error text;

-- Tracks whether a generation had brand-kit colors auto-injected into its
-- variables, so "My Brand" can show a filtered results section.
alter table public.generations
  add column if not exists used_brand_kit boolean not null default false;

-- Phase 1 of the platform growth plan: aspect ratio presets, model choice
-- (prep for phase 5 credits), and multi-variation generation. Recorded per
-- generation for history/display; all nullable since existing rows predate
-- this and the columns aren't required for the app to function.
alter table public.generations
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists model text,
  add column if not exists seed bigint;

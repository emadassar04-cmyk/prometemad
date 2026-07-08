-- Public bucket for the personal_styles before/after preview images shown
-- on the style picker (distinct from the private 'personal-photos' bucket
-- that holds real users' own uploaded selfies and generated results).
insert into storage.buckets (id, name, public)
values ('personal-style-examples', 'personal-style-examples', true)
on conflict (id) do nothing;

-- Temporary: allows the one-off seeding job (run from an external
-- automation with only the anon key available) to populate the 20 example
-- images. Scoped to this single, non-sensitive marketing-content bucket
-- only — never grant this on 'personal-photos'. Tightened to admin-only
-- once the initial seeding is done (see the follow-up migration).
create policy "anon can seed style example images"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'personal-style-examples');

create policy "anon can update style example images"
  on storage.objects for update
  to anon
  using (bucket_id = 'personal-style-examples')
  with check (bucket_id = 'personal-style-examples');

-- The 20 example images are seeded now; remove the temporary anon
-- write access to 'personal-style-examples' and restrict future writes
-- to admins only (reads stay public since the bucket itself is public).
drop policy if exists "anon can seed style example images" on storage.objects;
drop policy if exists "anon can update style example images" on storage.objects;

create policy "admins can write style example images"
  on storage.objects for all
  using (bucket_id = 'personal-style-examples' and is_admin())
  with check (bucket_id = 'personal-style-examples' and is_admin());

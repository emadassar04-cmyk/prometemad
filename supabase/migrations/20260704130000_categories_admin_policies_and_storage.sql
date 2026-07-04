-- categories had only a public-read policy; admins need write access too
-- (the seed script and admin panel both create/update categories/prompts).
create policy "only admins can write categories"
  on public.categories for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "only admins can update categories"
  on public.categories for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "only admins can delete categories"
  on public.categories for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- storage: only admins may upload prompt preview images; the bucket is
-- public so reads bypass RLS entirely via the /object/public/ path.
create policy "admins can upload prompt previews"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'prompt-previews'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins can update prompt previews"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'prompt-previews'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

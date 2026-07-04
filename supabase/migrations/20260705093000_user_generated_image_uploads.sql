-- Photo-personalization generations (Gemini) upload their result straight
-- from the Next.js server route, using the calling user's own session
-- rather than the service role — so unlike n8n's writes to this bucket,
-- these need an explicit RLS policy. Scoped to a per-user folder so one
-- user can never overwrite another user's generated image.
create policy "users can upload their own generated images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'generations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

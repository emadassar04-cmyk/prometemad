-- Revert the photo-upload (image-to-image) prompt feature: the Gemini
-- integration didn't pan out in testing, so this drops what
-- 20260705090000_photo_prompts.sql and
-- 20260705093000_user_generated_image_uploads.sql added.
drop policy if exists "users can upload their own generated images" on storage.objects;

alter table public.prompts
  drop column if exists requires_photo;

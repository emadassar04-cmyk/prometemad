-- Support prompts that require the user to upload their own photo
-- (image-to-image, face-preserving generation) alongside the existing
-- text-to-image prompts.
alter table public.prompts
  add column if not exists requires_photo boolean not null default false;

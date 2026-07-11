-- Personal Photos pivots from paid in-site generation to a self-serve
-- "copy the prompt, paste it into Gemini yourself" flow. The page must
-- work fully signed-out, so the usage-count bump (fired on copy) needs
-- anon execute too — previously only granted to authenticated callers.
alter table public.personal_styles add column if not exists custom_note_ar text;

grant execute on function public.increment_personal_style_usage(uuid) to anon;

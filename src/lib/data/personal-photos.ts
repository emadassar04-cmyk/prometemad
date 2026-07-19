import { createSupabaseServerClient } from "@/lib/supabase/server";

const PERSONAL_STYLE_COLUMNS =
  "id, slug, title_ar, title_en, tagline_ar, prompt_body, share_text_ar, category, custom_note_ar, example_before_url, example_after_url, usage_count, sort_order, is_trending";

export async function getActivePersonalStyles() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("personal_styles")
    .select(PERSONAL_STYLE_COLUMNS)
    .eq("is_active", true)
    .order("is_trending", { ascending: false })
    .order("usage_count", { ascending: false });

  return data ?? [];
}

export async function getPersonalStyleBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("personal_styles")
    .select(PERSONAL_STYLE_COLUMNS)
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

export async function getActivePersonalStyleSlugs() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("personal_styles")
    .select("slug")
    .eq("is_active", true);

  return data ?? [];
}

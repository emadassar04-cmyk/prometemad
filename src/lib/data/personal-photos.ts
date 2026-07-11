import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getActivePersonalStyles() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("personal_styles")
    .select(
      "id, slug, title_ar, title_en, tagline_ar, prompt_body, share_text_ar, category, custom_note_ar, example_before_url, example_after_url, usage_count, sort_order",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

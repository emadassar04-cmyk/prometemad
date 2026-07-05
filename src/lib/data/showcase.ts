import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getShowcaseGenerations(limit = 60) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("id, image_url, created_at, prompts(slug, title_ar, title_en)")
    .eq("status", "succeeded")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTotalGenerationCount() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("get_total_generation_count");
  return data ?? 0;
}

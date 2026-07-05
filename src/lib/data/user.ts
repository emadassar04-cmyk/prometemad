import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getUserGenerations(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("*, prompts(slug, title_ar, title_en)")
    .eq("user_id", userId)
    .eq("status", "succeeded")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserFavoritePrompts(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("favorites")
    .select("prompt_id, prompts(*, categories(slug, name_ar, name_en))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? [])
    .map((row) => row.prompts)
    .filter((prompt): prompt is NonNullable<typeof prompt> => !!prompt);
}

export async function getUserBrandKit(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("brand_kits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getUserBrandKitGenerations(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("*, prompts(slug, title_ar, title_en)")
    .eq("user_id", userId)
    .eq("status", "succeeded")
    .eq("used_brand_kit", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

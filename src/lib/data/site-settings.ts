import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SiteSettingsMap = Record<string, { value_ar: string | null; value_en: string | null }>;

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("*");
  const map: SiteSettingsMap = {};
  for (const row of data ?? []) {
    map[row.key] = { value_ar: row.value_ar, value_en: row.value_en };
  }
  return map;
}

export function pickSiteSetting(
  settings: SiteSettingsMap,
  key: string,
  locale: string,
  fallback: string,
): string {
  const row = settings[key];
  if (!row) return fallback;
  const value = locale === "ar" ? row.value_ar : row.value_en;
  return value && value.trim() !== "" ? value : fallback;
}

export type ActiveCampaign = {
  id: string;
  name_ar: string;
  name_en: string;
  category_id: string | null;
  categories: { slug: string } | null;
};

export async function getActiveCampaigns(): Promise<ActiveCampaign[]> {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("campaigns")
    .select("id, name_ar, name_en, category_id, categories(slug)")
    .lte("start_date", today)
    .gte("end_date", today);
  return (data ?? []) as unknown as ActiveCampaign[];
}

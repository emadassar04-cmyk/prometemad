"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const KEYS = ["hero_badge", "hero_title", "hero_subtitle", "seo_title", "seo_description"];

export async function saveSiteSettingsAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const supabase = await createSupabaseServerClient();

  const rows = KEYS.map((key) => ({
    key,
    value_ar: String(formData.get(`${key}_ar`) ?? ""),
    value_en: String(formData.get(`${key}_en`) ?? ""),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin/content`);
}

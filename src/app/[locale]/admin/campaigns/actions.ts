"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

function parseCampaignForm(formData: FormData): TablesInsert<"campaigns"> {
  return {
    name_ar: String(formData.get("name_ar") ?? ""),
    name_en: String(formData.get("name_en") ?? ""),
    category_id: String(formData.get("category_id") ?? "") || null,
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
  };
}

export async function saveCampaignAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const payload = parseCampaignForm(formData);

  const { error } = id
    ? await supabase.from("campaigns").update(payload).eq("id", id)
    : await supabase.from("campaigns").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/campaigns`);
  revalidatePath(`/${locale}`);
}

export async function deleteCampaignAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/campaigns`);
  revalidatePath(`/${locale}`);
}

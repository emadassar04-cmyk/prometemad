"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

function parseCategoryForm(formData: FormData): TablesInsert<"categories"> {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name_ar: String(formData.get("name_ar") ?? ""),
    name_en: String(formData.get("name_en") ?? ""),
    icon: String(formData.get("icon") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

export async function saveCategoryAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const payload = parseCategoryForm(formData);

  const { error } = id
    ? await supabase.from("categories").update(payload).eq("id", id)
    : await supabase.from("categories").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/categories`);
}

export async function deleteCategoryAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/categories`);
}

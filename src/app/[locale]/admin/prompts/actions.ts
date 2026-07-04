"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import type { TablesInsert } from "@/lib/supabase/types";

function parsePromptForm(formData: FormData): TablesInsert<"prompts"> {
  const tagsRaw = String(formData.get("tags") ?? "");
  const variablesRaw = String(formData.get("variables") ?? "[]");

  let variables: unknown = [];
  try {
    variables = JSON.parse(variablesRaw || "[]");
  } catch {
    variables = [];
  }

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title_ar: String(formData.get("title_ar") ?? ""),
    title_en: String(formData.get("title_en") ?? ""),
    description_ar: String(formData.get("description_ar") ?? "") || null,
    description_en: String(formData.get("description_en") ?? "") || null,
    prompt_text_en: String(formData.get("prompt_text_en") ?? ""),
    prompt_display_ar: String(formData.get("prompt_display_ar") ?? ""),
    variables: variables as never,
    category_id: String(formData.get("category_id") ?? "") || null,
    style: String(formData.get("style") ?? "") || null,
    model: String(formData.get("model") ?? "") || null,
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    preview_image_url: String(formData.get("preview_image_url") ?? "") || null,
    is_featured: formData.get("is_featured") === "on",
    status: String(formData.get("status") ?? "draft"),
  };
}

export async function savePromptAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const payload = parsePromptForm(formData);

  const { error } = id
    ? await supabase.from("prompts").update(payload).eq("id", id)
    : await supabase.from("prompts").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/prompts`);
  redirect({ href: "/admin/prompts", locale });
}

export async function deletePromptAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("prompts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/prompts`);
}

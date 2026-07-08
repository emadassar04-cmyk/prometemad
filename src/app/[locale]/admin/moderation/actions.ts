"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function approveGenerationAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("generations")
    .update({ is_public: true, moderation_status: "approved" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/moderation`);
}

export async function rejectGenerationAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("generations")
    .update({ is_public: false, moderation_status: "rejected" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/moderation`);
}

// Lets the admin feature/unfeature any succeeded generation in the showcase
// directly, independent of the submit-for-review flow above.
export async function setGenerationCuratedAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const curated = formData.get("curated") === "true";
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("generations")
    .update({ is_curated: curated })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/moderation`);
}

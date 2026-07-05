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

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function approveWorkspaceAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("approve_workspace", { p_workspace_id: id });
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/workspaces`);
}

export async function rejectWorkspaceAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("reject_workspace", { p_workspace_id: id });
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/workspaces`);
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestWorkspaceAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("request_workspace", { p_name: name });
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/workspace`);
}

export async function joinWorkspaceAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  if (!inviteCode) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("join_workspace", { p_invite_code: inviteCode });
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/workspace`);
}

export async function leaveWorkspaceAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("leave_workspace");
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/workspace`);
}

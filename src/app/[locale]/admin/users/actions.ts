"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function toggleBanAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const isBanned = formData.get("is_banned") === "true";
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: !isBanned })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/users`);
}

export async function toggleAdminAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "user");
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // An admin revoking their own admin role would lock themselves out with
  // no one left to undo it — block it here rather than relying on the
  // caller to remember not to click it.
  if (user?.id === id && role === "admin") {
    throw new Error("cannot revoke your own admin role");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: role === "admin" ? "user" : "admin" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/users`);
}

export async function setDailyLimitAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("daily_limit_override") ?? "").trim();
  const value = raw === "" ? null : Math.max(0, Number(raw) || 0);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({ daily_limit_override: value })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/admin/users`);
}

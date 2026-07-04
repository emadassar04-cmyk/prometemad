import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";

export async function requireAdmin(locale: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/sign-in", locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "admin") {
    redirect({ href: "/", locale });
  }

  return { supabase, user: user! };
}

export async function getAdminStats() {
  const supabase = await createSupabaseServerClient();

  const [{ count: totalPrompts }, { count: totalGenerations }, { count: totalUsers }] =
    await Promise.all([
      supabase.from("prompts").select("*", { count: "exact", head: true }),
      supabase.from("generations").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

  return {
    totalPrompts: totalPrompts ?? 0,
    totalGenerations: totalGenerations ?? 0,
    totalUsers: totalUsers ?? 0,
  };
}

export async function getAllPromptsForAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, categories(slug, name_ar, name_en)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPromptForAdmin(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("prompts").select("*").eq("id", id).single();
  return data;
}

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

// For API routes (can't redirect like requireAdmin does for pages) — returns
// the admin user, or null if the caller isn't signed in as an admin.
export async function requireAdminApi() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return null;

  return { supabase, user };
}

export type AdminDashboardStats = {
  total_prompts: number;
  total_generations: number;
  total_users: number;
  daily_generations: { day: string; count: number }[];
  top_prompts: {
    id: string;
    title_ar: string;
    title_en: string;
    generation_count: number;
  }[];
  top_categories: {
    name_ar: string;
    name_en: string;
    total_generations: number;
  }[];
};

// A plain per-table count query here would be silently scoped by RLS to the
// admin's own rows (generations' SELECT policy only allows own + publicly
// shared) — this calls a security-definer RPC that aggregates across every
// user instead, gated by its own internal admin check.
export async function getAdminStats(): Promise<AdminDashboardStats> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("admin_dashboard_stats");
  return data as unknown as AdminDashboardStats;
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

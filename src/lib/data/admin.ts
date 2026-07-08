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

export type AdminUserRow = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  is_banned: boolean;
  daily_limit_override: number | null;
  total_generations: number;
  generations_today: number;
};

// auth.users (email, last_sign_in_at) isn't queryable via the normal client
// at all, so this goes through a security-definer RPC rather than a table
// select — see admin_list_users() in the migrations.
export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("admin_list_users");
  return (data as unknown as AdminUserRow[]) ?? [];
}

// Relies on the "admins can read all generations" RLS policy (no RPC
// needed here, unlike users/stats — nothing in auth.users is required).
export async function getPendingModerationGenerations() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("*, prompts(slug, title_ar, title_en)")
    .eq("moderation_status", "pending")
    .order("created_at", { ascending: true });
  return data ?? [];
}

// Lets the admin feature any succeeded generation directly, independent of
// whether the owner ever submitted it for moderation.
export async function getRecentGenerationsForCuration(limit = 30) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("id, image_url, is_curated, created_at, prompts(slug, title_ar, title_en)")
    .eq("status", "succeeded")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAllCampaigns() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*, categories(slug, name_ar, name_en)")
    .order("start_date", { ascending: false });
  return data ?? [];
}

export async function getSubscribers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("subscribers")
    .select("*")
    .is("unsubscribed_at", null)
    .order("subscribed_at", { ascending: false });
  return data ?? [];
}

export async function getRecentFailedGenerations(limit = 50) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("*, prompts(title_ar, title_en)")
    .eq("status", "failed")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export type AssistantStats = {
  total_conversations: number;
  conversions: number;
  conversion_rate: number;
  top_recommended: { slug: string; title_ar: string; title_en: string; count: number }[];
};

// assistant_sessions has an "admin reads all sessions" RLS policy (unlike
// generations, which needs a security-definer RPC), so a plain select works
// here — aggregation happens in JS since the dataset is small, same pattern
// as getCategoriesWithCounts.
export async function getAssistantStats(): Promise<AssistantStats> {
  const supabase = await createSupabaseServerClient();
  const { data: sessions } = await supabase
    .from("assistant_sessions")
    .select("recommended_slug, led_to_generation");

  const rows = sessions ?? [];
  const total_conversations = rows.length;
  const conversions = rows.filter((r) => r.led_to_generation).length;
  const conversion_rate = total_conversations > 0 ? conversions / total_conversations : 0;

  const slugCounts = new Map<string, number>();
  for (const row of rows) {
    if (!row.recommended_slug) continue;
    slugCounts.set(row.recommended_slug, (slugCounts.get(row.recommended_slug) ?? 0) + 1);
  }

  const topSlugs = [...slugCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const { data: prompts } = await supabase
    .from("prompts")
    .select("slug, title_ar, title_en")
    .in("slug", topSlugs.map(([slug]) => slug));

  const promptsBySlug = new Map((prompts ?? []).map((p) => [p.slug, p]));
  const top_recommended = topSlugs.map(([slug, count]) => ({
    slug,
    title_ar: promptsBySlug.get(slug)?.title_ar ?? slug,
    title_en: promptsBySlug.get(slug)?.title_en ?? slug,
    count,
  }));

  return { total_conversations, conversions, conversion_rate, top_recommended };
}

export type GenerationVolumeToday = {
  succeeded: number;
  failed: number;
  pending: number;
};

export async function getGenerationVolumeToday(): Promise<GenerationVolumeToday> {
  const supabase = await createSupabaseServerClient();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("generations")
    .select("status")
    .gte("created_at", startOfDay.toISOString());

  const counts: GenerationVolumeToday = { succeeded: 0, failed: 0, pending: 0 };
  for (const row of data ?? []) {
    if (row.status === "succeeded") counts.succeeded++;
    else if (row.status === "failed") counts.failed++;
    else counts.pending++;
  }
  return counts;
}

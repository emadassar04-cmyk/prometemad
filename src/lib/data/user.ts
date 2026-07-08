import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getUserGenerations(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("generations")
    .select("*, prompts(slug, title_ar, title_en)")
    .eq("user_id", userId)
    .eq("status", "succeeded")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserFavoritePrompts(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("favorites")
    .select("prompt_id, prompts(*, categories(slug, name_ar, name_en))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? [])
    .map((row) => row.prompts)
    .filter((prompt): prompt is NonNullable<typeof prompt> => !!prompt);
}

const DEFAULT_DAILY_LIMIT = 10;

export type WorkspaceInfo =
  | { status: "none" }
  | { status: "pending" | "rejected"; name: string }
  | {
      status: "member";
      name: string;
      role: "owner" | "member";
      inviteCode: string;
      members: { username: string | null; role: string; dailyLimit: number }[];
      pooledLimit: number;
      usedToday: number;
    };

export async function getUserWorkspaceInfo(userId: string): Promise<WorkspaceInfo> {
  const supabase = await createSupabaseServerClient();

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (membership) {
    const [{ data: workspace }, { data: members }, { data: usage }] = await Promise.all([
      supabase
        .from("workspaces")
        .select("name, invite_code")
        .eq("id", membership.workspace_id)
        .single(),
      supabase
        .from("workspace_members")
        .select("role, profiles(username, daily_limit_override)")
        .eq("workspace_id", membership.workspace_id),
      supabase
        .from("workspace_daily_usage")
        .select("generations_count")
        .eq("workspace_id", membership.workspace_id)
        .eq("usage_date", new Date().toISOString().slice(0, 10))
        .maybeSingle(),
    ]);

    const memberRows = (members ?? []).map((m) => ({
      username: m.profiles?.username ?? null,
      role: m.role,
      dailyLimit: m.profiles?.daily_limit_override ?? DEFAULT_DAILY_LIMIT,
    }));

    return {
      status: "member",
      name: workspace?.name ?? "",
      role: membership.role as "owner" | "member",
      inviteCode: workspace?.invite_code ?? "",
      members: memberRows,
      pooledLimit: memberRows.reduce((sum, m) => sum + m.dailyLimit, 0),
      usedToday: usage?.generations_count ?? 0,
    };
  }

  const { data: ownRequest } = await supabase
    .from("workspaces")
    .select("name, status")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ownRequest && (ownRequest.status === "pending" || ownRequest.status === "rejected")) {
    return { status: ownRequest.status, name: ownRequest.name };
  }

  return { status: "none" };
}

export async function getUserReferralInfo(userId: string) {
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("referral_code").eq("id", userId).single(),
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", userId),
  ]);

  return {
    referralCode: profile?.referral_code ?? null,
    referralCount: count ?? 0,
  };
}

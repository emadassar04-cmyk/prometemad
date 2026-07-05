import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enhancePrompt } from "@/lib/gemini-text";

const DAILY_LIMIT = 20;
const MAX_IDEA_LENGTH = 300;

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const idea =
    typeof body?.idea === "string" ? body.idea.trim().slice(0, MAX_IDEA_LENGTH) : "";

  if (!idea) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  // Postgres's p_daily_limit param is `integer` (32-bit) — Number.MAX_SAFE_INTEGER
  // overflows it and makes PostgREST fail to match the RPC signature at all.
  const dailyLimit = profile?.role === "admin" ? 1_000_000 : DAILY_LIMIT;

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_enhance_usage",
    { p_user_id: user.id, p_daily_limit: dailyLimit },
  );

  if (quotaError) {
    return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  try {
    const result = await enhancePrompt(idea);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("enhance-prompt failed:", message);
    return NextResponse.json({ error: "enhance_failed", detail: message }, { status: 502 });
  }
}

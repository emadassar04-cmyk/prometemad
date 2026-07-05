import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { callGenerateWebhook } from "@/lib/n8n-generate";

const DAILY_LIMIT = 10;
const MAX_PROMPT_LENGTH = 2000;

// Generates an image from an arbitrary prompt (not tied to a catalog
// prompt_id) — used by Image-to-Prompt's "generate a similar image" button.
// Counts against the same daily image quota as the catalog generate flow.
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_banned, daily_limit_override")
    .eq("id", user.id)
    .single();

  if (profile?.is_banned) {
    return NextResponse.json({ error: "banned" }, { status: 403 });
  }
  const dailyLimit = profile?.daily_limit_override ?? DAILY_LIMIT;

  const body = await request.json().catch(() => null);
  const finalPrompt =
    typeof body?.prompt === "string" ? body.prompt.trim().slice(0, MAX_PROMPT_LENGTH) : "";
  if (!finalPrompt) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_daily_usage",
    { p_user_id: user.id, p_daily_limit: dailyLimit },
  );
  if (quotaError) {
    return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const seed = Math.floor(Math.random() * 1_000_000_000);
  const { data: generation, error: insertError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      prompt_id: null,
      final_prompt: finalPrompt,
      status: "pending",
      width: 1024,
      height: 1024,
      model: "flux-schnell",
      seed,
    })
    .select("id")
    .single();

  if (insertError || !generation) {
    return NextResponse.json({ error: "generation_insert_failed" }, { status: 500 });
  }

  try {
    const result = await callGenerateWebhook({
      userId: user.id,
      promptId: null,
      generationId: generation.id,
      finalPrompt,
      width: 1024,
      height: 1024,
      model: "flux-schnell",
      seed,
      accessToken: session?.access_token,
    });

    await supabase
      .from("generations")
      .update({
        status: "succeeded",
        image_url: result.image_url,
        provider: result.provider,
      })
      .eq("id", generation.id);

    return NextResponse.json({ generationId: generation.id, imageUrl: result.image_url });
  } catch (err) {
    await supabase
      .from("generations")
      .update({
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      })
      .eq("id", generation.id);

    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}

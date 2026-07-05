import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  parsePromptVariables,
  sanitizeVariableValues,
  substituteVariables,
} from "@/lib/prompt-variables";

const DAILY_LIMIT = 10;
const MAX_VARIABLE_LENGTH = 200;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60;

const MIN_DIMENSION = 256;
const MAX_DIMENSION = 2048;
const DEFAULT_DIMENSION = 1024;
const ALLOWED_VARIATIONS = new Set([1, 4]);
const ALLOWED_MODELS = new Set(["flux-schnell", "flux-dev", "sdxl"]);

function clampDimension(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_DIMENSION;
  return Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Math.round(num)));
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: withinRateLimit, error: rateLimitError } = await supabase.rpc(
    "try_increment_rate_limit",
    {
      p_user_id: user.id,
      p_max_requests: RATE_LIMIT_MAX_REQUESTS,
      p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
    },
  );

  if (rateLimitError) {
    return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
  }
  if (!withinRateLimit) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const promptId = body?.promptId;
  const rawVariables = body?.variables ?? {};

  if (typeof promptId !== "string") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const width = clampDimension(body?.width ?? DEFAULT_DIMENSION);
  const height = clampDimension(body?.height ?? DEFAULT_DIMENSION);
  const model = ALLOWED_MODELS.has(body?.model) ? body.model : "flux-schnell";
  const variationsRequested = ALLOWED_VARIATIONS.has(body?.variations)
    ? body.variations
    : 1;

  const { data: prompt, error: promptError } = await supabase
    .from("prompts")
    .select("id, prompt_text_en, variables, status")
    .eq("id", promptId)
    .eq("status", "published")
    .single();

  if (promptError || !prompt) {
    return NextResponse.json({ error: "prompt_not_found" }, { status: 404 });
  }

  const allowedKeys = parsePromptVariables(prompt.variables).map((v) => v.key);
  const sanitizedVariables = sanitizeVariableValues(
    rawVariables,
    allowedKeys,
    MAX_VARIABLE_LENGTH,
  );

  const finalPrompt = substituteVariables(
    prompt.prompt_text_en,
    sanitizedVariables,
  );

  // Each variation counts as one image against the daily quota — call the
  // atomic check+increment once per requested variation and stop as soon as
  // the limit is hit, so a partial batch is still possible near the cap.
  let allowedCount = 0;
  for (let i = 0; i < variationsRequested; i++) {
    const { data: allowed, error: quotaError } = await supabase.rpc(
      "try_increment_daily_usage",
      { p_user_id: user.id, p_daily_limit: DAILY_LIMIT },
    );
    if (quotaError) {
      return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
    }
    if (!allowed) break;
    allowedCount++;
  }

  if (allowedCount === 0) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const webhookUrl = process.env.N8N_GENERATE_IMAGE_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json({ error: "provider_not_configured" }, { status: 503 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  async function generateOne() {
    const seed = Math.floor(Math.random() * 1_000_000_000);

    const { data: generation, error: insertError } = await supabase
      .from("generations")
      .insert({
        user_id: user!.id,
        prompt_id: prompt!.id,
        final_prompt: finalPrompt,
        status: "pending",
        width,
        height,
        model,
        seed,
      })
      .select("id")
      .single();

    if (insertError || !generation) {
      return { error: "generation_insert_failed" as const };
    }

    try {
      const webhookResponse = await fetch(webhookUrl!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": webhookSecret!,
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          user_id: user!.id,
          prompt_id: prompt!.id,
          generation_id: generation.id,
          final_prompt: finalPrompt,
          width,
          height,
          model,
          seed,
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error(`webhook responded ${webhookResponse.status}`);
      }

      const result = (await webhookResponse.json()) as {
        image_url?: string;
        provider?: string;
      };

      if (!result.image_url) {
        throw new Error("webhook response missing image_url");
      }

      await supabase
        .from("generations")
        .update({
          status: "succeeded",
          image_url: result.image_url,
          provider: result.provider ?? "n8n",
        })
        .eq("id", generation.id);

      await supabase.rpc("increment_prompt_generation_count", {
        p_prompt_id: prompt!.id,
      });

      return { generationId: generation.id, imageUrl: result.image_url };
    } catch {
      await supabase
        .from("generations")
        .update({ status: "failed" })
        .eq("id", generation.id);

      return { generationId: generation.id, error: "generation_failed" as const };
    }
  }

  const results = await Promise.all(
    Array.from({ length: allowedCount }, () => generateOne()),
  );

  return NextResponse.json({
    results,
    limitReached: allowedCount < variationsRequested,
  });
}

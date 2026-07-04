import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  parsePromptVariables,
  sanitizeVariableValues,
  substituteVariables,
} from "@/lib/prompt-variables";

const DAILY_LIMIT = 10;
const MAX_VARIABLE_LENGTH = 200;

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const promptId = body?.promptId;
  const rawVariables = body?.variables ?? {};

  if (typeof promptId !== "string") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

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

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_daily_usage",
    { p_user_id: user.id, p_daily_limit: DAILY_LIMIT },
  );

  if (quotaError) {
    return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const { data: generation, error: insertError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      prompt_id: prompt.id,
      final_prompt: finalPrompt,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !generation) {
    return NextResponse.json({ error: "generation_insert_failed" }, { status: 500 });
  }

  const webhookUrl = process.env.N8N_GENERATE_IMAGE_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    await supabase
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generation.id);
    return NextResponse.json({ error: "provider_not_configured" }, { status: 503 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": webhookSecret,
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        prompt_id: prompt.id,
        generation_id: generation.id,
        final_prompt: finalPrompt,
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
      p_prompt_id: prompt.id,
    });

    return NextResponse.json({
      generationId: generation.id,
      imageUrl: result.image_url,
    });
  } catch {
    await supabase
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generation.id);

    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}

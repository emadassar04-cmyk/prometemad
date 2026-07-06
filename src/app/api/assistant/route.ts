import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAssistantConfig } from "@/lib/data/feature-settings";
import { getPublishedPromptsIndex } from "@/lib/data/prompts";
import { getAssistantReply, type AssistantMessage, type AssistantReply } from "@/lib/gemini-text";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 20;

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const config = await getAssistantConfig();
  if (!config.is_enabled) {
    return NextResponse.json({ error: "assistant_disabled" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = typeof body?.session_id === "string" ? body.session_id : null;
  const rawMessages: unknown[] = Array.isArray(body?.messages) ? body.messages : [];

  const messages: AssistantMessage[] = rawMessages
    .filter(
      (m): m is { role: string; content: string } =>
        !!m &&
        typeof m === "object" &&
        ((m as { role?: unknown }).role === "user" || (m as { role?: unknown }).role === "assistant") &&
        typeof (m as { content?: unknown }).content === "string",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  // Admins are exempt from daily quotas, matching every other AI feature —
  // 1_000_000 (not Number.MAX_SAFE_INTEGER) because Postgres's p_daily_limit
  // param is `integer` (32-bit).
  const dailyLimit = profile?.role === "admin" ? 1_000_000 : config.daily_limit;

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_assistant_usage",
    { p_user_id: user.id, p_daily_limit: dailyLimit },
  );
  if (quotaError) {
    return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const promptsIndex = await getPublishedPromptsIndex();
  const effectiveSystemPrompt = `${config.system_prompt}\n\nالحد الأقصى لعدد الأسئلة المسموح تسألها للمستخدم: ${config.max_questions}.`;

  let reply: AssistantReply;
  try {
    reply = await getAssistantReply(
      effectiveSystemPrompt,
      promptsIndex.map((p) => ({
        slug: p.slug,
        title_ar: p.title_ar,
        description_ar: p.description_ar,
        category: p.category,
        variables: p.variables.map((v) => ({ key: v.key, label_ar: v.label_ar })),
      })),
      messages,
    );
  } catch (err) {
    console.error("assistant reply failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "assistant_failed" }, { status: 502 });
  }

  // The governing rule: never trust a recommended slug without re-checking
  // it against the actual published-prompts index server-side.
  if (reply.type === "recommendation" && reply.recommendation) {
    const matched = promptsIndex.find((p) => p.slug === reply.recommendation!.slug);
    if (!matched) {
      reply = {
        ...reply,
        type: "fallback",
        recommendation: null,
        fallback_action: "enhancer",
      };
    } else {
      // title_ar/category/preview_image_url come from the verified DB row,
      // not the LLM's own text, so a stale/hallucinated label can't leak through.
      reply = {
        ...reply,
        recommendation: {
          ...reply.recommendation,
          title_ar: matched.title_ar,
          category: matched.category,
          preview_image_url: matched.preview_image_url,
        },
      };
    }
  }

  const updatedMessages = [
    ...messages,
    { role: "assistant" as const, content: reply.message_ar },
  ];

  let outSessionId = sessionId;
  if (sessionId) {
    await supabase
      .from("assistant_sessions")
      .update({
        messages: updatedMessages,
        recommended_slug: reply.recommendation?.slug ?? null,
      })
      .eq("id", sessionId)
      .eq("user_id", user.id);
  } else {
    const { data: session } = await supabase
      .from("assistant_sessions")
      .insert({
        user_id: user.id,
        messages: updatedMessages,
        recommended_slug: reply.recommendation?.slug ?? null,
      })
      .select("id")
      .single();
    outSessionId = session?.id ?? null;
  }

  return NextResponse.json({ ...reply, session_id: outSessionId });
}

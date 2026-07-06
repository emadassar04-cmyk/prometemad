import { NextResponse } from "next/server";
import { getAssistantConfig } from "@/lib/data/feature-settings";
import { getPublishedPromptsIndex } from "@/lib/data/prompts";
import { getAssistantReply } from "@/lib/gemini-text";

// TEMPORARY — Phase 1 backend verification only. Bypasses auth/quota/session
// persistence to isolate "does the recommendation engine return valid JSON
// with a real slug" from RLS/cookie auth concerns. Remove after testing.
export async function POST(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message : "";
  if (!message) {
    return NextResponse.json({ error: "missing_message" }, { status: 400 });
  }

  const config = await getAssistantConfig();
  const promptsIndex = await getPublishedPromptsIndex();
  const effectiveSystemPrompt = `${config.system_prompt}\n\nالحد الأقصى لعدد الأسئلة المسموح تسألها للمستخدم: ${config.max_questions}.`;

  const reply = await getAssistantReply(
    effectiveSystemPrompt,
    promptsIndex.map((p) => ({
      slug: p.slug,
      title_ar: p.title_ar,
      description_ar: p.description_ar,
      category: p.category,
      variables: p.variables.map((v) => ({ key: v.key, label_ar: v.label_ar })),
    })),
    [{ role: "user", content: message }],
  );

  const slugExists =
    reply.type !== "recommendation" ||
    !reply.recommendation ||
    promptsIndex.some((p) => p.slug === reply.recommendation!.slug);

  return NextResponse.json({
    reply,
    slugExists,
    isEnabled: config.is_enabled,
    promptsIndexCount: promptsIndex.length,
  });
}

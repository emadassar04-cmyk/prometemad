import { NextResponse } from "next/server";
import { getAssistantConfig } from "@/lib/data/feature-settings";
import { getPublishedPromptsIndex } from "@/lib/data/prompts";
import { getAssistantReply, type AssistantMessage } from "@/lib/groq-text";

// TEMPORARY — verifies the new dual-role (explain site / recommend prompt)
// behavior. Delete once confirmed working.
export async function POST(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const messages: AssistantMessage[] = Array.isArray(body?.messages)
    ? body.messages
    : [{ role: "user", content: "عايز إعلان لمطعمي للعيد" }];

  try {
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
      messages,
    );

    return NextResponse.json(reply);
  } catch (err) {
    return NextResponse.json(
      { error: "failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

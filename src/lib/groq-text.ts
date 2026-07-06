// Groq-hosted open-weight model (OpenAI-compatible chat completions API) —
// used only by the assistant's recommendation engine. Free tier, and the
// 70B model reasons noticeably better on multi-turn "what does this user
// actually want" conversations than gemini-2.5-flash did.
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function callGroqJson(instructions: string): Promise<unknown> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: instructions }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const raw = data.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error("Groq response did not include content");
  }

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  return JSON.parse(cleaned);
}

export type AssistantMessage = { role: "user" | "assistant"; content: string };

export type AssistantPromptIndexEntry = {
  slug: string;
  title_ar: string;
  description_ar: string | null;
  category: string | null;
  variables: { key: string; label_ar: string }[];
};

export type AssistantReply = {
  type: "question" | "recommendation" | "fallback";
  message_ar: string;
  quick_replies: string[];
  recommendation: {
    slug: string;
    title_ar: string;
    category: string | null;
    preview_image_url: string | null;
    variables: Record<string, string>;
  } | null;
  fallback_action: "enhancer" | null;
};

// Conversational recommendation engine for the "assistant" feature — picks
// an existing published prompt (by slug) from the index it's given, rather
// than inventing one. Callers MUST re-verify the returned slug against the
// database before trusting it; this only guards against malformed JSON.
export async function getAssistantReply(
  systemPrompt: string,
  promptsIndex: AssistantPromptIndexEntry[],
  history: AssistantMessage[],
): Promise<AssistantReply> {
  const historyText = history
    .map((m) => `${m.role === "user" ? "المستخدم" : "المساعد"}: ${m.content}`)
    .join("\n");

  const instructions = `${systemPrompt}

القائمة (JSON، البرومبتات المنشورة المتاحة فقط — اختر slug من هنا حصريًا، ممنوع اختراع slug غير موجود):
${JSON.stringify(promptsIndex)}

المحادثة حتى الآن:
${historyText}

أرجع JSON فقط بالضبط بهذا الشكل، بدون أي نص إضافي أو markdown:
{
  "type": "question" | "recommendation" | "fallback",
  "message_ar": "نص ودّي بالعربي",
  "quick_replies": ["رد سريع 1", "رد سريع 2"],
  "recommendation": { "slug": "...", "title_ar": "...", "category": "...", "variables": { "مفتاح": "قيمة" } },
  "fallback_action": "enhancer"
}
لو type مش "recommendation"، خلي "recommendation" = null. لو type مش "fallback"، خلي "fallback_action" = null.`;

  const parsed = (await callGroqJson(instructions)) as Partial<AssistantReply>;

  if (!parsed.type || !parsed.message_ar) {
    throw new Error("Groq response missing required fields");
  }

  return {
    type: parsed.type,
    message_ar: parsed.message_ar,
    quick_replies: Array.isArray(parsed.quick_replies) ? parsed.quick_replies : [],
    recommendation: parsed.recommendation ?? null,
    fallback_action: parsed.fallback_action ?? null,
  };
}

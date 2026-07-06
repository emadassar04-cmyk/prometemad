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
  type: "question" | "recommendation" | "fallback" | "explanation";
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

// Kept in code (not the admin-editable system_prompt) since it's a factual
// description of what the site actually has — an admin free-typing this
// would drift out of sync with real features over time.
const SITE_FEATURES_AR = `
- المكتبة (الصفحة الرئيسية): تصفح وابحث عن برومبتات صور جاهزة، فلترة حسب الفئة/الستايل/النموذج، اضغط على أي برومبت وخصّص متغيراته وولّد صورة حقيقية.
- محسّن البرومبت (في الصفحة الرئيسية): اكتب فكرة بسيطة بالعربي وهو يحوّلها لبرومبت احترافي بالعربي والإنجليزي.
- صورة لبرومبت (من القائمة العلوية): ارفع أي صورة عجبتك وهو يرجّعلك برومبت جاهز يوصفها.
- هويتي / Brand Kit (من القائمة العلوية): احفظ ألوان وشعار علامتك التجارية عشان تتعبّى تلقائيًا في أي برومبت فيه متغيّر لون.
- صوري (من القائمة العلوية): كل الصور اللي المستخدم ولّدها قبل كده.
- مفضلتي (من القائمة العلوية): البرومبتات اللي حفظها المستخدم عشان يرجعلها بسهولة.
- معرض الإلهام (من القائمة العلوية): صور اتولّدت فعلاً من مستخدمين تانيين للإلهام.
- دعوة أصدقاء (من القائمة العلوية): رابط دعوة، كل صديق يسجّل بيه يديله رصيد صور إضافي.
- الحد اليومي: كل مستخدم مسجّل له عدد صور مجانية يوميًا (بيتجدد كل يوم).
`;

// Conversational engine for the "assistant" feature. Has two jobs it must
// pick between per message: (1) explain the site/how to use it — general
// "how does this work" questions get type=explanation, no recommendation;
// (2) recommend an existing published prompt (by slug) from the index it's
// given, rather than inventing one, when the user describes a concrete
// design goal. Callers MUST re-verify any returned slug against the
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

عندك دورين، واختار الصح حسب كلام المستخدم:
1. لو المستخدم بيسأل سؤال عام عن الموقع نفسه أو إزاي يستخدمه أو إيه الميزات الموجودة (زي "إزاي استخدم الموقع؟"، "إيه اللي أقدر أعمله هنا؟"، "فين ألاقي كذا؟") — رجّع type="explanation"، واشرحله في "message_ar" باستخدام معلومات الموقع دي فقط (ممنوع تخترع ميزات مش موجودة):
${SITE_FEATURES_AR}
اقترح في "quick_replies" حاجات هو ممكن يحب يجرّبها بعد كده.

2. لو المستخدم بيوصف هدف تصميم محدد (زي "عايز بوست رمضان" أو "لوجو لمتجري") — كمّل بنفس الأسلوب المعتاد: اسأل سؤال توضيحي واحد أو اتنين لو محتاج (type="question")، وبعدين رشّح برومبت واحد فقط من القائمة دي (type="recommendation"، استخدم الـslug كما هو حصريًا، ممنوع اختراع slug غير موجود):
${JSON.stringify(promptsIndex)}
لو مفيش برومبت مناسب إطلاقًا لهدفه، رجّع type="fallback" مع fallback_action="enhancer".

المحادثة حتى الآن:
${historyText}

أرجع JSON فقط بالضبط بهذا الشكل، بدون أي نص إضافي أو markdown:
{
  "type": "question" | "recommendation" | "fallback" | "explanation",
  "message_ar": "نص ودّي بالعربي",
  "quick_replies": ["رد سريع 1", "رد سريع 2"],
  "recommendation": { "slug": "...", "title_ar": "...", "category": "...", "variables": { "مفتاح": "قيمة" } },
  "fallback_action": "enhancer"
}
لو type مش "recommendation"، خلي "recommendation" = null. لو type مش "fallback"، خلي "fallback_action" = null.
مهم جدًا: الـ"slug" حقل تقني داخلي للنظام فقط — ممنوع تمامًا ذكره أو كتابته (بالإنجليزي أو بين علامتي اقتباس) داخل "message_ar" أو أي نص بيشوفه المستخدم. لما تتكلم عن البرومبت في "message_ar"، استخدم اسمه بالعربي (title_ar) أو وصف طبيعي بس.`;

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

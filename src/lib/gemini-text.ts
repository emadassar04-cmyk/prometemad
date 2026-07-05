// Text-only Gemini call (no image modality) used by the AI prompt enhancer —
// a much simpler, well-established request shape than the image-generation
// endpoint, so this has higher confidence of working without live testing.
const MODEL = "gemini-2.5-flash";

export type EnhancedPrompt = { ar: string; en: string };

export async function enhancePrompt(idea: string): Promise<EnhancedPrompt> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const instructions = `You are a professional AI image-prompt engineer for an Arabic image-generation platform.
Turn the user's simple Arabic idea into a polished prompt pair for a text-to-image model:
- "en": a detailed, professional English prompt (composition, lighting, style, quality descriptors).
- "ar": a natural Arabic description of that same prompt, for display to Arabic-speaking users.

Respond with ONLY a raw JSON object like {"en": "...", "ar": "..."} — no markdown, no code fences, no extra text.

Idea: """${idea}"""`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instructions }] }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw new Error("Gemini response did not include text");
  }

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  const parsed = JSON.parse(cleaned) as Partial<EnhancedPrompt>;

  if (!parsed.en || !parsed.ar) {
    throw new Error("Gemini response missing en/ar fields");
  }

  return { en: parsed.en, ar: parsed.ar };
}

export type AdminGeneratedPrompt = {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  prompt_display_ar: string;
  prompt_text_en: string;
  style: string;
  tags: string[];
  variables: {
    key: string;
    label_ar: string;
    label_en: string;
    default: string;
    type: "text";
  }[];
};

async function callGeminiJson(
  instructions: string,
  image?: { base64: string; mimeType: string },
): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const parts: Record<string, unknown>[] = image
    ? [{ inlineData: { mimeType: image.mimeType, data: image.base64 } }, { text: instructions }]
    : [{ text: instructions }];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw new Error("Gemini response did not include text");
  }

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  return JSON.parse(cleaned);
}

// Used by the admin "✨ generate prompt" assist button — turns a short Arabic
// idea into a full prompt record ready to review/tweak before saving.
export async function generateAdminPrompt(idea: string): Promise<AdminGeneratedPrompt> {
  const instructions = `You are a professional AI image-prompt engineer building entries for a curated Arabic image-prompt library (marketing/creative use cases).

From the admin's short Arabic idea, produce a complete prompt record as raw JSON (no markdown, no code fences, no extra text) with EXACTLY this shape:
{
  "title_ar": "short Arabic title",
  "title_en": "short English title",
  "description_ar": "one-sentence Arabic description",
  "description_en": "one-sentence English description",
  "prompt_display_ar": "Arabic description of the prompt shown to users, with {{variable_key}} placeholders where customizable",
  "prompt_text_en": "detailed English prompt sent to the image model, with the SAME {{variable_key}} placeholders (composition, lighting, style, quality descriptors)",
  "style": "one short style word, e.g. cinematic, minimal, festive, bold",
  "tags": ["3-5 short English tags"],
  "variables": [
    { "key": "variable_key", "label_ar": "Arabic label", "label_en": "English label", "default": "sensible default value", "type": "text" }
  ]
}

Include 1-3 variables max, only for things a user would plausibly want to customize (e.g. product name, color, text). Every {{key}} used in prompt_display_ar and prompt_text_en MUST have a matching entry in "variables".

Idea: """${idea}"""`;

  const parsed = (await callGeminiJson(instructions)) as Partial<AdminGeneratedPrompt>;

  if (
    !parsed.title_ar ||
    !parsed.title_en ||
    !parsed.prompt_display_ar ||
    !parsed.prompt_text_en
  ) {
    throw new Error("Gemini response missing required fields");
  }

  return {
    title_ar: parsed.title_ar,
    title_en: parsed.title_en,
    description_ar: parsed.description_ar ?? "",
    description_en: parsed.description_en ?? "",
    prompt_display_ar: parsed.prompt_display_ar,
    prompt_text_en: parsed.prompt_text_en,
    style: parsed.style ?? "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    variables: Array.isArray(parsed.variables) ? parsed.variables : [],
  };
}

// Image-to-Prompt: reverse-engineers an uploaded photo into a usable ar/en
// prompt pair, using Gemini's vision input (image + text -> text), the same
// generateContent endpoint as the text-only calls above, just with an
// inlineData image part added.
export async function describeImageAsPrompt(
  base64: string,
  mimeType: string,
): Promise<EnhancedPrompt> {
  const instructions = `You are a professional AI image-prompt engineer for an Arabic image-generation platform.

Look at the attached image and reverse-engineer it into a prompt pair a user could use to generate a similar image with a text-to-image model:
- "en": a detailed, professional English prompt describing the subject, composition, lighting, style, and quality descriptors needed to recreate a similar image.
- "ar": a natural Arabic description of that same prompt, for display to Arabic-speaking users.

Respond with ONLY a raw JSON object like {"en": "...", "ar": "..."} — no markdown, no code fences, no extra text.`;

  const parsed = (await callGeminiJson(instructions, { base64, mimeType })) as Partial<EnhancedPrompt>;

  if (!parsed.en || !parsed.ar) {
    throw new Error("Gemini response missing en/ar fields");
  }

  return { en: parsed.en, ar: parsed.ar };
}

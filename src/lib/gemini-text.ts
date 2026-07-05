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

// Identity-preserving photo styling for the Personal Photos feature.
// gpt-image-1.5 with input_fidelity "high" was chosen after a live test
// (not assumption) confirmed it both accepts the request and reliably keeps
// the uploaded person's face recognizable — the two prior attempts at a
// photo-personalization feature in this codebase shipped unverified API
// assumptions and never worked, so this call shape is verified end-to-end.
const MODEL = "gpt-image-1.5";

const IDENTITY_GUARDRAIL =
  "IMPORTANT: Preserve the exact facial identity, facial structure, skin tone, and distinguishing features of the person in the uploaded photo. Do not change their face — only apply the described style, outfit, and scene changes.";

export async function editPersonalPhoto(params: {
  imageBytes: Uint8Array;
  mimeType: string;
  promptBody: string;
}): Promise<Uint8Array> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const form = new FormData();
  form.set("model", MODEL);
  form.set("quality", "medium");
  form.set("input_fidelity", "high");
  form.set("prompt", `${params.promptBody}\n\n${IDENTITY_GUARDRAIL}`);
  form.append(
    "image[]",
    new Blob([Buffer.from(params.imageBytes)], { type: params.mimeType }),
    "source.jpg",
  );

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal: AbortSignal.timeout(75_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    if (response.status === 429 || response.status === 402) {
      throw new Error("openai_quota_exhausted");
    }
    throw new Error(`OpenAI image edit failed: ${response.status} ${errorBody}`.slice(0, 500));
  }

  const data = (await response.json()) as { data?: { b64_json?: string }[] };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI response missing image data");
  }

  return new Uint8Array(Buffer.from(b64, "base64"));
}

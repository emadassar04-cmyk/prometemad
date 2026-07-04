// Face-preserving image-to-image generation (photo personalization prompts —
// "put my face in this scene") using Google's Gemini multimodal image model.
// Chosen over fal.ai because Google AI Studio issues API keys on a free tier
// with no payment method required, unlike fal.ai's pay-as-you-go billing.
//
// IMPORTANT: the request/response shape below (inlineData, responseModalities,
// etc.) is best-effort from Google's public docs and has NOT been verified
// against a live call in this environment (no network access to
// generativelanguage.googleapis.com here). Test it once with a real
// GEMINI_API_KEY before relying on it in production, and adjust field names
// if Google's actual response differs.
const MODEL = "gemini-2.5-flash-image";

export type GeminiPhotoResult = {
  imageBase64: string;
  imageMimeType: string;
};

export async function generateImageFromPhoto(
  photoBase64: string,
  photoMimeType: string,
  prompt: string,
): Promise<GeminiPhotoResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: photoMimeType, data: photoBase64 } },
            ],
          },
        ],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: {
      content?: {
        parts?: { inlineData?: { mimeType?: string; data?: string } }[];
      };
    }[];
  };

  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData?.data,
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini response did not include an image");
  }

  return {
    imageBase64: imagePart.inlineData.data,
    imageMimeType: imagePart.inlineData.mimeType ?? "image/png",
  };
}

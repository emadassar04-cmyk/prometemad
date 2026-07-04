import type { GenerateImageOptions, GenerateImageResult, ImageProvider } from "./types";

// Production provider: FLUX.1 [schnell] via fal.ai (~$0.003/image).
// FAL_KEY must only ever be set in a trusted server environment (n8n or this
// server's env) — never exposed to the browser.
export const falProvider: ImageProvider = {
  name: "fal",
  async generateImage(
    prompt: string,
    options: GenerateImageOptions = {},
  ): Promise<GenerateImageResult> {
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      throw new Error("FAL_KEY is not configured");
    }

    const { width = 1024, height = 1024, seed } = options;

    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: { width, height },
        num_images: 1,
        seed,
      }),
    });

    if (!response.ok) {
      throw new Error(`fal.ai request failed: ${response.status}`);
    }

    const data = (await response.json()) as { images?: { url: string }[] };
    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      throw new Error("fal.ai response did not include an image URL");
    }

    return { imageUrl, provider: "fal" };
  },
};

// Face-preserving image-to-image generation (photo personalization prompts —
// "put my face in this scene"). Uses fal-ai/flux-pulid, which takes a
// reference face photo plus a text prompt and keeps the face recognizable.
//
// IMPORTANT: the request/response field names below (reference_image_url,
// id_weight, etc.) are best-effort from fal.ai's public docs and have NOT
// been verified against a live call in this environment (no network access
// to fal.run here). Before enabling this in production, test it once from
// fal.ai's own playground for the flux-pulid model and adjust the field
// names in this function to match if they differ.
export async function generateImageFromPhoto(
  photoDataUri: string,
  prompt: string,
  options: GenerateImageOptions = {},
): Promise<GenerateImageResult> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error("FAL_KEY is not configured");
  }

  const { width = 1024, height = 1024 } = options;

  const response = await fetch("https://fal.run/fal-ai/flux-pulid", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      reference_image_url: photoDataUri,
      image_size: { width, height },
      num_images: 1,
      id_weight: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`fal.ai request failed: ${response.status}`);
  }

  const data = (await response.json()) as { images?: { url: string }[] };
  const imageUrl = data.images?.[0]?.url;
  if (!imageUrl) {
    throw new Error("fal.ai response did not include an image URL");
  }

  return { imageUrl, provider: "fal-flux-pulid" };
}

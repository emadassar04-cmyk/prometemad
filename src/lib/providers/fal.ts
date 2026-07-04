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

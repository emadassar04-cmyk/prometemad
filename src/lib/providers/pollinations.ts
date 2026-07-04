import type { GenerateImageOptions, GenerateImageResult, ImageProvider } from "./types";

// Free, keyless provider used for local development and seed content.
// image.pollinations.ai serves the generated image directly at a
// deterministic URL built from the prompt, so "generating" is just building
// that URL — no polling needed.
export const pollinationsProvider: ImageProvider = {
  name: "pollinations",
  async generateImage(
    prompt: string,
    options: GenerateImageOptions = {},
  ): Promise<GenerateImageResult> {
    const { width = 1024, height = 1024, seed } = options;
    const params = new URLSearchParams({
      width: String(width),
      height: String(height),
      nologo: "true",
    });
    if (seed !== undefined) params.set("seed", String(seed));

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?${params.toString()}`;

    // Pollinations generates lazily on first fetch; warm it up here so
    // callers can trust the URL resolves to a real image immediately.
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Pollinations request failed: ${response.status}`);
    }

    return { imageUrl, provider: "pollinations" };
  },
};

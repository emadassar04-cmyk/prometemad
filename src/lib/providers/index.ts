import { pollinationsProvider } from "./pollinations";
import { falProvider } from "./fal";
import type { ImageProvider, GenerateImageOptions, GenerateImageResult } from "./types";

const providers: Record<string, ImageProvider> = {
  pollinations: pollinationsProvider,
  fal: falProvider,
};

function getProvider(): ImageProvider {
  const key = process.env.IMAGE_PROVIDER ?? "pollinations";
  const provider = providers[key];
  if (!provider) {
    throw new Error(`Unknown IMAGE_PROVIDER "${key}"`);
  }
  return provider;
}

export async function generateImage(
  prompt: string,
  options?: GenerateImageOptions,
): Promise<GenerateImageResult> {
  return getProvider().generateImage(prompt, options);
}

export type { ImageProvider, GenerateImageOptions, GenerateImageResult };

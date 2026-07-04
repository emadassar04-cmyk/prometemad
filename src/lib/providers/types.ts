export type GenerateImageOptions = {
  width?: number;
  height?: number;
  seed?: number;
};

export type GenerateImageResult = {
  imageUrl: string;
  provider: string;
};

export interface ImageProvider {
  name: string;
  generateImage(
    prompt: string,
    options?: GenerateImageOptions,
  ): Promise<GenerateImageResult>;
}

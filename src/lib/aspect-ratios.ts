export type AspectRatioKey = "instagram" | "story" | "cover" | "linkedin" | "custom";

export const ASPECT_RATIOS: {
  key: AspectRatioKey;
  labelKey: string;
  width: number | null;
  height: number | null;
}[] = [
  { key: "instagram", labelKey: "aspectRatioInstagram", width: 1080, height: 1080 },
  { key: "story", labelKey: "aspectRatioStory", width: 1080, height: 1920 },
  { key: "cover", labelKey: "aspectRatioCover", width: 1200, height: 675 },
  { key: "linkedin", labelKey: "aspectRatioLinkedIn", width: 1080, height: 1350 },
  { key: "custom", labelKey: "aspectRatioCustom", width: null, height: null },
];

export const LAST_ASPECT_RATIO_STORAGE_KEY = "promptly:lastAspectRatio";

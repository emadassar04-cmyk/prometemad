const SHOWCASE_LIKES_KEY = "promptly:showcaseLikes";

export function getShowcaseLikes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SHOWCASE_LIKES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setShowcaseLikes(ids: string[]) {
  window.localStorage.setItem(SHOWCASE_LIKES_KEY, JSON.stringify(ids));
}

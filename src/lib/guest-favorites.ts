const GUEST_FAVORITES_KEY = "promptly:guestFavorites";

export function getGuestFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setGuestFavorites(ids: string[]) {
  window.localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(ids));
}

export function clearGuestFavorites() {
  window.localStorage.removeItem(GUEST_FAVORITES_KEY);
}

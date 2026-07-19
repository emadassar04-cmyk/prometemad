// Appended client-side so it always travels with the copied prompt, even
// though it isn't stored on the row (keeps prompt_body editable from the
// admin panel without repeating this boilerplate on every style).
export const IDENTITY_GUARDRAIL =
  "CRITICAL: Use the uploaded photo as the identity reference. Preserve the exact same face, facial features, skin tone, hairstyle and expression 100% — do not beautify, do not change age or identity. Photorealistic result unless the style says otherwise.";

export function categoryLabelKey(category: string) {
  return `category${category.charAt(0).toUpperCase()}${category.slice(1)}`;
}

export type PromptVariable = {
  key: string;
  label_ar: string;
  label_en: string;
  default?: string;
  type?: "text" | "select";
  options?: string[];
};

export function parsePromptVariables(raw: unknown): PromptVariable[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is PromptVariable =>
      !!item && typeof item === "object" && typeof (item as PromptVariable).key === "string",
  );
}

export function substituteVariables(
  template: string,
  values: Record<string, string>,
) {
  return template.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (match, key: string) => {
    const value = values[key];
    return value !== undefined && value !== "" ? value : match;
  });
}

/**
 * Keeps only variable values whose key is declared on the prompt, coerces
 * non-string input away, and caps length — the server-side allowlist that
 * stops a caller from injecting arbitrary `{{key}}` substitutions or
 * oversized payloads into the prompt sent to the image provider.
 */
export function sanitizeVariableValues(
  rawVariables: unknown,
  allowedKeys: Iterable<string>,
  maxLength = 200,
): Record<string, string> {
  const allowed = new Set(allowedKeys);
  const sanitized: Record<string, string> = {};

  if (!rawVariables || typeof rawVariables !== "object") return sanitized;

  for (const [key, value] of Object.entries(rawVariables as Record<string, unknown>)) {
    if (!allowed.has(key) || typeof value !== "string") continue;
    sanitized[key] = value.slice(0, maxLength);
  }

  return sanitized;
}

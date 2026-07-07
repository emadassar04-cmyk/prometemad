"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

type GeneratedPrompt = {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  prompt_display_ar: string;
  prompt_text_en: string;
  style: string;
  tags: string[];
  variables: unknown[];
};

function setFieldValue(id: string, value: string) {
  const el = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
  if (el) el.value = value;
}

export function PromptAiAssistant() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = (await response.json()) as GeneratedPrompt & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "generation_failed");

      setFieldValue("title_ar", data.title_ar);
      setFieldValue("title_en", data.title_en);
      setFieldValue("description_ar", data.description_ar);
      setFieldValue("description_en", data.description_en);
      setFieldValue("prompt_display_ar", data.prompt_display_ar);
      setFieldValue("prompt_text_en", data.prompt_text_en);
      setFieldValue("style", data.style);
      setFieldValue("tags", data.tags.join(", "));
      setFieldValue("variables", JSON.stringify(data.variables, null, 2));
    } catch {
      setError("تعذّر توليد البرومبت، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-4">
      <label className="text-sm font-medium">
        ✨ اكتب فكرة بالعربي وهنولّد لك البرومبت كامل
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="مثال: إعلان عطر فاخر لعيد الأم"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !idea.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-navy disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          ولّد
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

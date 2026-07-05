"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Wand2 } from "lucide-react";

export function PromptTestGenerate({ promptId }: { promptId?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleTestGenerate() {
    const promptTextEl = document.getElementById(
      "prompt_text_en",
    ) as HTMLTextAreaElement | null;
    const variablesEl = document.getElementById(
      "variables",
    ) as HTMLTextAreaElement | null;

    if (!promptTextEl?.value.trim()) {
      setError("اكتب البرومبت (EN) الأول");
      return;
    }

    let variables: unknown = [];
    try {
      variables = variablesEl?.value ? JSON.parse(variablesEl.value) : [];
    } catch {
      setError("صيغة المتغيرات (JSON) مش سليمة");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/admin/test-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_text_en: promptTextEl.value,
          variables,
          prompt_id: promptId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "generation_failed");
      setImageUrl(data.imageUrl);
    } catch {
      setError("تعذّر توليد صورة الاختبار، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4">
      <button
        type="button"
        onClick={handleTestGenerate}
        disabled={loading}
        className="flex w-fit items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
        ولّد صورة اختبار (بالقيم الافتراضية للمتغيرات)
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {imageUrl && (
        <div className="relative aspect-square w-48 overflow-hidden rounded-lg border border-border">
          <Image src={imageUrl} alt="" fill sizes="192px" className="object-cover" />
        </div>
      )}
    </div>
  );
}

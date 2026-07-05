"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";

export function BackfillPreviewsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/backfill-previews", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setResult("تعذّر التنفيذ، حاول مرة أخرى");
        return;
      }
      setResult(
        data.processed === 0
          ? "كل البرومبتات عندها صورة معاينة بالفعل"
          : `تم: ${data.succeeded} نجحت${data.failed.length ? `، ${data.failed.length} فشلت (${data.failed.join(", ")})` : ""}`,
      );
      router.refresh();
    } catch {
      setResult("تعذّر التنفيذ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        توليد صور المعاينة الناقصة
      </button>
      {result && <span className="text-xs text-muted">{result}</span>}
    </div>
  );
}

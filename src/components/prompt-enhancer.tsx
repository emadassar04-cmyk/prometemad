"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";

export function PromptEnhancer({
  isSignedIn,
  locale,
}: {
  isSignedIn: boolean;
  locale: string;
}) {
  const t = useTranslations("enhancer");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ ar: string; en: string } | null>(null);
  const [copied, setCopied] = useState<"ar" | "en" | null>(null);

  async function handleEnhance() {
    if (!isSignedIn) {
      window.location.href = `/${locale}/sign-in`;
      return;
    }
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await response.json();

      if (response.status === 429) {
        setError(t("dailyLimitReached"));
        return;
      }
      if (!response.ok) {
        setError(t("error"));
        return;
      }
      setResult(data);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(which: "ar" | "en") {
    if (!result) return;
    await navigator.clipboard.writeText(result[which]);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
        <Sparkles className="h-4 w-4 text-accent" />
        {t("title")}
      </h2>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder={t("placeholder")}
        rows={2}
        maxLength={300}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <button
        type="button"
        onClick={handleEnhance}
        disabled={loading || !idea.trim()}
        className="accent-gradient-bg mt-3 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {loading ? t("loading") : t("enhance")}
      </button>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted">{t("arabicLabel")}</span>
              <button
                type="button"
                onClick={() => handleCopy("ar")}
                className="flex items-center gap-1 text-xs text-accent-2 hover:text-accent"
              >
                {copied === "ar" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            <p dir="rtl" className="text-sm leading-relaxed">
              {result.ar}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted">{t("englishLabel")}</span>
              <button
                type="button"
                onClick={() => handleCopy("en")}
                className="flex items-center gap-1 text-xs text-accent-2 hover:text-accent"
              >
                {copied === "en" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            <p dir="ltr" className="text-xs leading-relaxed text-muted">
              {result.en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

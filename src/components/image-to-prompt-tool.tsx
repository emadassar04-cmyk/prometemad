"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, Copy, ImageUp, Loader2, Sparkles, Wand2 } from "lucide-react";

export function ImageToPromptTool({
  isSignedIn,
  locale,
}: {
  isSignedIn: boolean;
  locale: string;
}) {
  const t = useTranslations("imageToPrompt");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ ar: string; en: string } | null>(null);
  const [copied, setCopied] = useState<"ar" | "en" | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setResult(null);
    setGeneratedImageUrl(null);
    setError(null);
    if (selected) setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleAnalyze() {
    if (!isSignedIn) {
      window.location.assign(`/${locale}/sign-in`);
      return;
    }
    if (!file) return;

    setAnalyzing(true);
    setError(null);
    setResult(null);
    setGeneratedImageUrl(null);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/image-to-prompt", { method: "POST", body });
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
      setAnalyzing(false);
    }
  }

  async function handleCopy(which: "ar" | "en") {
    if (!result) return;
    await navigator.clipboard.writeText(result[which]);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleGenerateSimilar() {
    if (!result) return;
    setGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/generate-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: result.en }),
      });
      const data = await response.json();

      if (response.status === 429) {
        setGenerateError(t("generateDailyLimitReached"));
        return;
      }
      if (!response.ok) {
        setGenerateError(t("generateError"));
        return;
      }
      setGeneratedImageUrl(data.imageUrl);
    } catch {
      setGenerateError(t("generateError"));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          handleFileChange(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-sm transition-colors ${
          isDraggingOver
            ? "border-accent bg-accent/5 text-foreground"
            : "border-border text-muted hover:border-accent hover:text-foreground"
        }`}
      >
        {previewUrl ? (
          <span className="relative h-24 w-24 overflow-hidden rounded-lg bg-background">
            <Image src={previewUrl} alt="" fill sizes="96px" className="object-contain" />
          </span>
        ) : (
          <ImageUp className="h-6 w-6" />
        )}
        <span className="font-medium">{t("chooseImage")}</span>
        <span className="text-xs text-muted">{t("dragDropHint")}</span>
      </button>

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || analyzing}
        className="accent-gradient-bg mt-4 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {analyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {analyzing ? t("analyzing") : t("analyze")}
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

          <button
            type="button"
            onClick={handleGenerateSimilar}
            disabled={generating}
            className="flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-accent disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {generating ? t("generating") : t("generateSimilar")}
          </button>

          {generateError && <p className="text-sm text-red-400">{generateError}</p>}

          {generatedImageUrl && (
            <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border">
              <Image
                src={generatedImageUrl}
                alt=""
                fill
                sizes="384px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, ImageUp, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { ShareButtons } from "@/components/share-buttons";

type PersonalStyle = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  tagline_ar: string;
  share_text_ar: string;
  category: string;
  example_before_url: string | null;
  example_after_url: string | null;
  usage_count: number;
  sort_order: number;
};

const CATEGORIES = ["professional", "cinematic", "heritage", "art", "fun"] as const;

type Step = "upload" | "styles" | "result";

export function PersonalPhotosTool({
  isSignedIn,
  locale,
  styles,
  referralLink,
}: {
  isSignedIn: boolean;
  locale: string;
  styles: PersonalStyle[];
  referralLink: string;
}) {
  const t = useTranslations("personalPhotos");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<PersonalStyle | null>(null);

  function handleFileChange(selected: File | null) {
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
    setStep("styles");
  }

  async function handleSelectStyle(style: PersonalStyle) {
    if (!isSignedIn) {
      window.location.assign(`/${locale}/sign-in`);
      return;
    }
    if (!file || generating) return;

    setGenerating(true);
    setError(null);
    setActiveStyle(style);
    setStep("result");

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("styleId", style.id);
      const response = await fetch("/api/personal-photos/generate", {
        method: "POST",
        body,
      });
      const data = await response.json();

      const errorMessages: Record<string, string> = {
        daily_limit_reached: t("errorDailyLimitReached"),
        banned: t("errorBanned"),
        provider_quota_exhausted: t("errorProviderQuotaExhausted"),
        missing_file: t("errorMissingFile"),
        unsupported_file_type: t("errorUnsupportedType"),
        file_too_large: t("errorFileTooLarge"),
      };

      if (!response.ok || !data.resultUrl) {
        setError(errorMessages[data?.error] ?? t("errorGenerationFailed"));
        return;
      }
      setResultUrl(data.resultUrl);
    } catch {
      setError(t("errorGenerationFailed"));
    } finally {
      setGenerating(false);
    }
  }

  function handleTryAnotherStyle() {
    setResultUrl(null);
    setError(null);
    setActiveStyle(null);
    setStep("styles");
  }

  function handleStartOver() {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    setActiveStyle(null);
    setStep("upload");
  }

  const filteredStyles =
    categoryFilter === "all" ? styles : styles.filter((s) => s.category === categoryFilter);

  const styleTitle = activeStyle ? (locale === "ar" ? activeStyle.title_ar : activeStyle.title_en) : "";

  return (
    <div className="flex flex-col gap-6">
      {step === "upload" && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-1 text-lg font-semibold">{t("step1Title")}</h2>
          <p className="mb-4 text-sm text-muted">{t("step1Hint")}</p>

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
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-14 text-sm transition-colors ${
              isDraggingOver
                ? "border-accent bg-accent/5 text-foreground"
                : "border-border text-muted hover:border-accent hover:text-foreground"
            }`}
          >
            <ImageUp className="h-7 w-7" />
            <span className="font-medium">{t("chooseImage")}</span>
            <span className="text-xs text-muted">{t("dragDropHint")}</span>
          </button>
        </div>
      )}

      {step === "styles" && previewUrl && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background">
              <Image src={previewUrl} alt="" fill sizes="56px" className="object-cover" unoptimized />
            </span>
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm text-accent-2 hover:text-accent"
            >
              {t("changePhoto")}
            </button>
          </div>

          <h2 className="text-lg font-semibold">{t("step2Title")}</h2>

          <div className="flex flex-wrap gap-2">
            {["all", ...CATEGORIES].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  categoryFilter === category
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border text-muted hover:border-accent hover:text-foreground"
                }`}
              >
                {t(
                  `category${category.charAt(0).toUpperCase()}${category.slice(1)}` as Parameters<
                    typeof t
                  >[0],
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filteredStyles.map((style) => {
              const title = locale === "ar" ? style.title_ar : style.title_en;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectStyle(style)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface text-start transition-colors hover:border-accent"
                >
                  <span className="relative aspect-square w-full overflow-hidden bg-background">
                    {style.example_after_url ? (
                      <Image
                        src={style.example_after_url}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <Sparkles className="h-6 w-6 text-muted" />
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-0.5 p-2.5">
                    <span className="truncate text-sm font-medium">{title}</span>
                    {style.usage_count > 0 && (
                      <span className="text-xs text-muted">
                        {t("usedCount", { count: style.usage_count })}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {!isSignedIn && <p className="text-sm text-muted">{t("signInToUse")}</p>}
        </div>
      )}

      {step === "result" && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">{t("step3Title")}</h2>

          {generating && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm text-muted">{t("generating")}</p>
            </div>
          )}

          {!generating && error && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                type="button"
                onClick={handleTryAnotherStyle}
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-accent"
              >
                <RefreshCw className="h-4 w-4" />
                {t("tryAnotherStyle")}
              </button>
            </div>
          )}

          {!generating && !error && resultUrl && previewUrl && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">{t("before")}</span>
                  <span className="relative aspect-square w-full overflow-hidden rounded-xl bg-background">
                    <Image src={previewUrl} alt="" fill sizes="50vw" className="object-cover" unoptimized />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">{t("after")}</span>
                  <span className="relative aspect-square w-full overflow-hidden rounded-xl bg-background">
                    <Image src={resultUrl} alt={styleTitle} fill sizes="50vw" className="object-cover" />
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={resultUrl}
                  download
                  className="accent-gradient-bg flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  {t("downloadResult")}
                </a>
                <ShareButtons url={referralLink} text={activeStyle?.share_text_ar} />
                <button
                  type="button"
                  onClick={handleTryAnotherStyle}
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-accent"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t("tryAnotherStyle")}
                </button>
              </div>

              <button
                type="button"
                onClick={handleStartOver}
                className="w-fit text-sm text-accent-2 hover:text-accent"
              >
                {t("startOver")}
              </button>

              <p className="text-xs text-muted">{t("privacyNote")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

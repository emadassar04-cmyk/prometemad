"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Layers,
  Loader2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  parsePromptVariables,
  substituteVariables,
} from "@/lib/prompt-variables";
import {
  ASPECT_RATIOS,
  LAST_ASPECT_RATIO_STORAGE_KEY,
  type AspectRatioKey,
} from "@/lib/aspect-ratios";
import { FavoriteButton } from "@/components/favorite-button";
import { PromptRating } from "@/components/prompt-rating";
import { ShareButtons } from "@/components/share-buttons";
import { SITE_URL } from "@/lib/site-url";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const ImageEditorModal = dynamic(
  () => import("@/components/image-editor-modal").then((m) => m.ImageEditorModal),
  { ssr: false },
);

type PromptRow = Tables<"prompts"> & {
  categories: { slug: string; name_ar: string; name_en: string } | null;
};

type ModelOption = "flux-schnell" | "flux-dev" | "sdxl";

type GenerationResult = {
  generationId: string;
  imageUrl?: string;
  error?: string;
};

export function PromptWorkspace({
  prompt,
  isFavorited,
  isSignedIn,
  brandColors,
  brandLogoUrl,
  ratingAverage,
  ratingCount,
  userRating,
}: {
  prompt: PromptRow;
  isFavorited: boolean;
  isSignedIn: boolean;
  brandColors?: string[] | null;
  brandLogoUrl?: string | null;
  ratingAverage?: number;
  ratingCount?: number;
  userRating?: number | null;
}) {
  const t = useTranslations("prompt");
  const locale = useLocale() as "ar" | "en";
  const supabase = createSupabaseBrowserClient();

  const variables = useMemo(
    () => parsePromptVariables(prompt.variables),
    [prompt.variables],
  );

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      variables.map((v) => [
        v.key,
        brandColors?.length && v.key.toLowerCase().includes("color")
          ? brandColors.join(" and ")
          : (v.default ?? ""),
      ]),
    ),
  );
  const [copied, setCopied] = useState(false);
  const [openedInGemini, setOpenedInGemini] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialNotice, setPartialNotice] = useState<string | null>(null);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);

  const [aspectRatioKey, setAspectRatioKey] = useState<AspectRatioKey>(() => {
    if (typeof window === "undefined") return "instagram";
    const saved = window.localStorage.getItem(LAST_ASPECT_RATIO_STORAGE_KEY);
    return saved && ASPECT_RATIOS.some((preset) => preset.key === saved)
      ? (saved as AspectRatioKey)
      : "instagram";
  });
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [model, setModel] = useState<ModelOption>("flux-schnell");

  function handleAspectRatioChange(key: AspectRatioKey) {
    setAspectRatioKey(key);
    window.localStorage.setItem(LAST_ASPECT_RATIO_STORAGE_KEY, key);
  }

  const activePreset = ASPECT_RATIOS.find((preset) => preset.key === aspectRatioKey);
  const width = activePreset?.width ?? customWidth;
  const height = activePreset?.height ?? customHeight;

  const finalPromptEn = substituteVariables(prompt.prompt_text_en, values);
  const finalPromptAr = substituteVariables(prompt.prompt_display_ar, values);

  async function handleCopy() {
    await navigator.clipboard.writeText(finalPromptEn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    await supabase.rpc("increment_prompt_copy_count", {
      p_prompt_id: prompt.id,
    });
  }

  async function handleOpenInGemini() {
    await navigator.clipboard.writeText(finalPromptEn);
    setOpenedInGemini(true);
    setTimeout(() => setOpenedInGemini(false), 2500);
    window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
  }

  async function runGenerate(variations: 1 | 2) {
    if (!isSignedIn) {
      window.location.href = `/${locale}/sign-in`;
      return;
    }

    setGenerating(true);
    setError(null);
    setPartialNotice(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt.id,
          variables: values,
          width,
          height,
          model,
          variations,
        }),
      });
      const data = await response.json();

      if (response.status === 429) {
        setError(
          data?.error === "rate_limited"
            ? t("rateLimited")
            : t("dailyLimitReached"),
        );
        return;
      }
      if (!response.ok) {
        setError(t("generateError"));
        return;
      }

      setResults(data.results ?? []);
      if (data.limitReached) {
        setPartialNotice(
          t("variationsPartial", {
            count: data.results?.length ?? 0,
            requested: variations,
          }),
        );
      }
    } catch {
      setError(t("generateError"));
    } finally {
      setGenerating(false);
    }
  }

  const title = locale === "ar" ? prompt.title_ar : prompt.title_en;
  const description =
    locale === "ar" ? prompt.description_ar : prompt.description_en;

  const successfulResults = results.filter((r) => r.imageUrl);
  const promptPageUrl = `${SITE_URL}/${locale}/prompt/${prompt.slug}`;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <div>
        {successfulResults.length > 0 ? (
          <div
            className={cn(
              "grid gap-3",
              successfulResults.length > 1 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {results.map((result) => (
              <div
                key={result.generationId}
                className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated"
              >
                {result.imageUrl ? (
                  <>
                    <Image
                      src={result.imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute end-2 top-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingImageUrl(result.imageUrl!)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-accent hover:text-white"
                        title={t("editImage")}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <ShareButtons url={promptPageUrl} text={title} />
                      <a
                        href={result.imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-accent hover:text-white"
                        title={t("downloadImage")}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-red-400">
                    {t("generateError")}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated">
            <Image
              src={prompt.preview_image_url ?? ""}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
        {generating && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            {t("generating")}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="mt-2 text-muted">{description}</p>}
          </div>
          <FavoriteButton
            promptId={prompt.id}
            initialFavorited={isFavorited}
            isSignedIn={isSignedIn}
          />
        </div>

        <PromptRating
          promptId={prompt.id}
          average={ratingAverage ?? 0}
          count={ratingCount ?? 0}
          initialUserRating={userRating ?? null}
          isSignedIn={isSignedIn}
        />

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-muted">{t("aspectRatio")}</h2>
          <select
            value={aspectRatioKey}
            onChange={(e) => handleAspectRatioChange(e.target.value as AspectRatioKey)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {ASPECT_RATIOS.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {t(preset.labelKey)}
              </option>
            ))}
          </select>
          {aspectRatioKey === "custom" && (
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs text-muted">{t("customWidth")}</label>
                <input
                  type="number"
                  min={256}
                  max={2048}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs text-muted">{t("customHeight")}</label>
                <input
                  type="number"
                  min={256}
                  max={2048}
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          <h2 className="mt-2 text-sm font-semibold text-muted">{t("model")}</h2>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as ModelOption)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="flux-schnell">{t("modelFluxSchnell")}</option>
            <option value="flux-dev" disabled>
              {t("modelFluxDev")} — {t("comingSoon")}
            </option>
            <option value="sdxl" disabled>
              {t("modelSdxl")} — {t("comingSoon")}
            </option>
          </select>
        </div>

        {variables.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-muted">
              {t("variables")}
            </h2>
            {variables.map((variable) => (
              <div key={variable.key} className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-sm">
                  {locale === "ar" ? variable.label_ar : variable.label_en}
                  {brandColors?.length && variable.key.toLowerCase().includes("color") && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-2">
                      {t("fromBrandKit")}
                    </span>
                  )}
                </label>
                {variable.type === "select" && variable.options ? (
                  <select
                    value={values[variable.key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [variable.key]: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    {variable.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={values[variable.key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [variable.key]: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted">
              {t("finalPreview")}
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-accent-2 hover:text-accent"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? t("copied") : t("copy")}
              </button>
              <button
                type="button"
                onClick={handleOpenInGemini}
                className="flex items-center gap-1.5 text-sm text-accent-2 hover:text-accent"
              >
                {openedInGemini ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {openedInGemini ? t("copied") : t("openInGemini")}
              </button>
            </div>
          </div>
          <p dir="rtl" className="text-sm leading-relaxed">
            {finalPromptAr}
          </p>
          <p dir="ltr" className="text-xs leading-relaxed text-muted">
            {finalPromptEn}
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {partialNotice && <p className="text-sm text-accent-2">{partialNotice}</p>}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => runGenerate(1)}
            disabled={generating}
            className={cn(
              "accent-gradient-bg flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50",
            )}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating
              ? t("generating")
              : isSignedIn
                ? t("generate")
                : t("signInToGenerate")}
          </button>
          {isSignedIn && (
            <button
              type="button"
              onClick={() => runGenerate(2)}
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-medium text-accent-2 transition-colors hover:bg-accent/10 disabled:opacity-50"
            >
              <Layers className="h-4 w-4" />
              {t("generateVariations")}
            </button>
          )}
        </div>
      </div>

      {editingImageUrl && (
        <ImageEditorModal
          imageUrl={editingImageUrl}
          logoUrl={brandLogoUrl}
          onClose={() => setEditingImageUrl(null)}
        />
      )}
    </div>
  );
}

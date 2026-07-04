"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Check, Copy, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  parsePromptVariables,
  substituteVariables,
} from "@/lib/prompt-variables";
import { FavoriteButton } from "@/components/favorite-button";
import type { Tables } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PromptRow = Tables<"prompts"> & {
  categories: { slug: string; name_ar: string; name_en: string } | null;
};

export function PromptWorkspace({
  prompt,
  isFavorited,
  isSignedIn,
}: {
  prompt: PromptRow;
  isFavorited: boolean;
  isSignedIn: boolean;
}) {
  const t = useTranslations("prompt");
  const locale = useLocale() as "ar" | "en";
  const supabase = createSupabaseBrowserClient();

  const variables = useMemo(
    () => parsePromptVariables(prompt.variables),
    [prompt.variables],
  );

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(variables.map((v) => [v.key, v.default ?? ""])),
  );
  const [copied, setCopied] = useState(false);
  const [openedInGemini, setOpenedInGemini] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

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

  async function handleGenerate() {
    if (!isSignedIn) {
      window.location.href = `/${locale}/sign-in`;
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt.id, variables: values }),
      });
      const data = await response.json();

      if (response.status === 429) {
        setError(t("dailyLimitReached"));
        return;
      }
      if (!response.ok) {
        setError(t("generateError"));
        return;
      }

      setResultImageUrl(data.imageUrl);
    } catch {
      setError(t("generateError"));
    } finally {
      setGenerating(false);
    }
  }

  const title = locale === "ar" ? prompt.title_ar : prompt.title_en;
  const description =
    locale === "ar" ? prompt.description_ar : prompt.description_en;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated">
          <Image
            src={resultImageUrl ?? prompt.preview_image_url ?? ""}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {generating && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}
        </div>
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

        {variables.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-muted">
              {t("variables")}
            </h2>
            {variables.map((variable) => (
              <div key={variable.key} className="flex flex-col gap-1.5">
                <label className="text-sm">
                  {locale === "ar" ? variable.label_ar : variable.label_en}
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

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className={cn(
            "accent-gradient-bg flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50",
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
      </div>
    </div>
  );
}

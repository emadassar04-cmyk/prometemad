"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react";
import { ShareButtons } from "@/components/share-buttons";

type PersonalStyle = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  tagline_ar: string;
  prompt_body: string;
  share_text_ar: string;
  category: string;
  custom_note_ar: string | null;
  example_before_url: string | null;
  example_after_url: string | null;
  usage_count: number;
  sort_order: number;
};

const CATEGORIES = ["trending", "professional", "cinematic", "heritage", "art", "fun"] as const;

// Appended client-side so it always travels with the copied prompt, even
// though it isn't stored on the row (keeps prompt_body editable from the
// admin panel without repeating this boilerplate on every style).
const IDENTITY_GUARDRAIL =
  "CRITICAL: Use the uploaded photo as the identity reference. Preserve the exact same face, facial features, skin tone, hairstyle and expression 100% — do not beautify, do not change age or identity. Photorealistic result unless the style says otherwise.";

type CategoryKey = (typeof CATEGORIES)[number];

function categoryLabelKey(category: string) {
  return `category${category.charAt(0).toUpperCase()}${category.slice(1)}`;
}

export function PersonalPhotosTool({
  locale,
  styles,
  referralLink,
}: {
  locale: string;
  styles: PersonalStyle[];
  referralLink: string;
}) {
  const t = useTranslations("personalPhotos");
  const [categoryFilter, setCategoryFilter] = useState<"all" | CategoryKey>("all");

  const filteredStyles =
    categoryFilter === "all" ? styles : styles.filter((s) => s.category === categoryFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 text-center text-sm sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <span>{t("howItWorksStep1")}</span>
        <span className="text-muted">←</span>
        <span>{t("howItWorksStep2")}</span>
        <span className="text-muted">←</span>
        <span>{t("howItWorksStep3")}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...CATEGORIES] as const).map((category) => (
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
            {t(categoryLabelKey(category) as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredStyles.map((style) => (
          <PersonalStyleCard key={style.id} style={style} locale={locale} referralLink={referralLink} />
        ))}
      </div>
    </div>
  );
}

function PersonalStyleCard({
  style,
  locale,
  referralLink,
}: {
  style: PersonalStyle;
  locale: string;
  referralLink: string;
}) {
  const t = useTranslations("personalPhotos");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [geminiToast, setGeminiToast] = useState(false);

  const title = locale === "ar" ? style.title_ar : style.title_en;
  const fullPrompt = `${style.prompt_body}\n\n${IDENTITY_GUARDRAIL}`;

  function trackUsage() {
    fetch("/api/personal-photos/track-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styleId: style.id }),
    }).catch(() => {});
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    trackUsage();
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleTryInGemini() {
    await navigator.clipboard.writeText(fullPrompt);
    trackUsage();
    setGeminiToast(true);
    setTimeout(() => setGeminiToast(false), 3500);
    window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-background">
        {style.example_after_url && (
          <Image
            src={style.example_after_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted">{style.tagline_ar}</p>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted">
            {t(categoryLabelKey(style.category) as Parameters<typeof t>[0])}
          </span>
          <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted">
            {t("badgeGeminiPrompt")}
          </span>
          <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted">
            {t("badgeNanoBanana")}
          </span>
        </div>

        {style.usage_count > 0 && (
          <span className="text-xs text-muted">{t("usedCount", { count: style.usage_count })}</span>
        )}

        {style.custom_note_ar && (
          <div className="flex items-start gap-1.5 rounded-lg bg-accent/10 p-2 text-xs">
            <span>ℹ️</span>
            <span>{style.custom_note_ar}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-center gap-1 rounded-lg bg-background py-1.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? t("hidePrompt") : t("showPrompt")}
        </button>

        {expanded && (
          <pre
            dir="ltr"
            className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-navy p-2.5 text-start font-mono text-[11px] leading-relaxed text-white/90 selection:bg-accent/40"
          >
            {fullPrompt}
          </pre>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="accent-gradient-bg flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t("promptCopied") : t("copyPrompt")}
          </button>
          <button
            type="button"
            onClick={handleTryInGemini}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("tryInGemini")}
          </button>
          <ShareButtons url={referralLink} text={style.share_text_ar} />
        </div>

        {geminiToast && <p className="text-[11px] text-accent-2">{t("geminiCopyToast")}</p>}
      </div>
    </article>
  );
}

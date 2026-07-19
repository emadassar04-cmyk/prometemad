"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, ExternalLink } from "lucide-react";
import { ShareButtons } from "@/components/share-buttons";
import { IDENTITY_GUARDRAIL } from "@/lib/personal-photos-shared";

export function PersonalStyleDetailActions({
  styleId,
  promptBody,
  shareText,
  shareUrl,
}: {
  styleId: string;
  promptBody: string;
  shareText: string;
  shareUrl: string;
}) {
  const t = useTranslations("personalPhotos");
  const [copied, setCopied] = useState(false);
  const [geminiToast, setGeminiToast] = useState(false);
  const fullPrompt = `${promptBody}\n\n${IDENTITY_GUARDRAIL}`;

  function trackUsage() {
    fetch("/api/personal-photos/track-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ styleId }),
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
    <div className="flex flex-col gap-3">
      <pre
        dir="ltr"
        className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-navy p-4 text-start font-mono text-sm leading-relaxed text-white/90 selection:bg-accent/40"
      >
        {fullPrompt}
      </pre>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="accent-gradient-bg flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t("promptCopied") : t("copyPrompt")}
        </button>
        <button
          type="button"
          onClick={handleTryInGemini}
          className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent"
        >
          <ExternalLink className="h-4 w-4" />
          {t("tryInGemini")}
        </button>
        <ShareButtons url={shareUrl} text={shareText} />
      </div>

      {geminiToast && <p className="text-xs text-accent-2">{t("geminiCopyToast")}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { ShareButtons } from "@/components/share-buttons";

export function InviteCard({
  referralLink,
  referralCount,
}: {
  referralLink: string;
  referralCount: number;
}) {
  const t = useTranslations("invite");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="mb-4 text-sm text-muted">{t("bonusExplanation")}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          readOnly
          value={referralLink}
          onFocus={(e) => e.target.select()}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="accent-gradient-bg flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? t("copied") : t("copyLink")}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted">
          {t("referralCount", { count: referralCount })}
        </span>
        <ShareButtons url={referralLink} text={t("shareText")} />
      </div>
    </div>
  );
}

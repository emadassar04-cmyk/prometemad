"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Share2 } from "lucide-react";

export function ShareButtons({ url, text }: { url: string; text?: string }) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text ?? "");

  async function handleCopyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-accent hover:text-white"
        title={t("share")}
      >
        <Share2 className="h-4 w-4" />
      </button>
      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute end-0 top-10 z-10 flex flex-col gap-1 rounded-xl border border-border bg-surface p-2 shadow-lg"
        >
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-start text-sm hover:bg-background"
          >
            {t("whatsapp")}
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-start text-sm hover:bg-background"
          >
            {t("twitter")}
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-start text-sm hover:bg-background"
          >
            {t("facebook")}
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-start text-sm hover:bg-background"
          >
            {copied && <Check className="h-3.5 w-3.5" />}
            {copied ? t("linkCopied") : t("copyLink")}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

export function WorkspaceInviteCard({ inviteCode }: { inviteCode: string }) {
  const t = useTranslations("workspace");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        readOnly
        value={inviteCode}
        onFocus={(e) => e.target.select()}
        className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-center text-sm font-mono tracking-widest text-muted outline-none"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="accent-gradient-bg flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? t("copied") : t("copyCode")}
      </button>
    </div>
  );
}

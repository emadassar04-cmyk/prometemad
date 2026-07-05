"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function NewsletterComposer() {
  const t = useTranslations("admin");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "done" | "error" | "not_configured"
  >("idle");
  const [result, setResult] = useState<{ sent: number; failed?: number } | null>(
    null,
  );

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return;
    setStatus("loading");
    setResult(null);

    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html: `<p>${body.replace(/\n/g, "<br/>")}</p>`,
        }),
      });
      const data = await response.json();

      if (response.status === 503) {
        setStatus("not_configured");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-border p-4">
      <h2 className="mb-3 text-sm font-semibold text-muted">
        {t("newsletterCompose")}
      </h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("newsletterSubjectPlaceholder")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder={t("newsletterBodyPlaceholder")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={status === "loading" || !subject.trim() || !body.trim()}
          className="accent-gradient-bg w-fit rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {status === "loading" ? t("newsletterSending") : t("newsletterSend")}
        </button>

        {status === "not_configured" && (
          <p className="text-sm text-amber-400">
            {t("newsletterNotConfigured")}
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">{t("newsletterSendError")}</p>
        )}
        {status === "done" && result && (
          <p className="text-sm text-accent-2">
            {t("newsletterSendResult", {
              sent: result.sent,
              failed: result.failed ?? 0,
            })}
          </p>
        )}
      </div>
    </div>
  );
}

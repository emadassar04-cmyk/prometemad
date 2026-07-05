"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-xs text-muted">{t("subscribed")}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xs flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="accent-gradient-bg whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? t("loading") : t("subscribe")}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">{t("error")}</p>
      )}
    </form>
  );
}

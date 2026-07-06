"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Recommendation = {
  slug: string;
  title_ar: string;
  category: string | null;
  preview_image_url: string | null;
  variables: Record<string, string>;
};

type AssistantApiReply = {
  type: "question" | "recommendation" | "fallback";
  message_ar: string;
  quick_replies: string[];
  recommendation: Recommendation | null;
  fallback_action: "enhancer" | null;
  session_id: string | null;
  error?: string;
};

const STORAGE_KEY = "promptly_assistant_session";

function loadStoredSession(): { sessionId: string | null; messages: ChatMessage[] } {
  if (typeof window === "undefined") return { sessionId: null, messages: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessionId: null, messages: [] };
    const saved = JSON.parse(raw) as { sessionId: string | null; messages: ChatMessage[] };
    if (Array.isArray(saved.messages) && saved.messages.length > 0) {
      return { sessionId: saved.sessionId ?? null, messages: saved.messages };
    }
    return { sessionId: null, messages: [] };
  } catch {
    return { sessionId: null, messages: [] };
  }
}

export function AssistantChat({
  isSignedIn,
  locale,
  starterSuggestions,
}: {
  isSignedIn: boolean;
  locale: string;
  starterSuggestions: string[];
}) {
  const t = useTranslations("assistant");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredSession().messages);
  const [sessionId, setSessionId] = useState<string | null>(() => loadStoredSession().sessionId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [fallbackAction, setFallbackAction] = useState<"enhancer" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function persist(nextMessages: ChatMessage[], nextSessionId: string | null) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessionId: nextSessionId, messages: nextMessages }),
    );
  }

  async function sendMessage(text: string) {
    if (!isSignedIn) {
      window.location.href = `/${locale}/sign-in`;
      return;
    }
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);
    setQuickReplies([]);
    setRecommendation(null);
    setFallbackAction(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, messages: nextMessages }),
      });
      const data = (await response.json()) as AssistantApiReply;

      if (response.status === 429) {
        setError(t("dailyLimitReached"));
        return;
      }
      if (!response.ok) {
        setError(t("error"));
        return;
      }

      const withReply: ChatMessage[] = [...nextMessages, { role: "assistant", content: data.message_ar }];
      setMessages(withReply);
      setSessionId(data.session_id);
      setQuickReplies(data.quick_replies ?? []);
      setRecommendation(data.recommendation ?? null);
      setFallbackAction(data.fallback_action ?? null);
      persist(withReply, data.session_id);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  function handleGenerateNow(rec: Recommendation) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(rec.variables ?? {})) {
      if (value) params.set(`var_${key}`, value);
    }
    const qs = params.toString();
    window.location.href = `/${locale}/prompt/${rec.slug}${qs ? `?${qs}` : ""}`;
  }

  function resetConversation() {
    setMessages([]);
    setSessionId(null);
    setQuickReplies([]);
    setRecommendation(null);
    setFallbackAction(null);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-5 py-4 text-start transition-colors hover:border-accent"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-accent" />
          {t("entryTitle")}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs text-accent-2">
          <MessageCircle className="h-3.5 w-3.5" />
          {t("entryCta")}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-accent" />
          {t("title")}
        </h2>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={resetConversation}
              className="text-xs text-muted hover:text-accent-2"
            >
              {t("newConversation")}
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-background hover:text-foreground"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex max-h-96 flex-col gap-2 overflow-y-auto rounded-lg border border-border bg-background p-3"
      >
        {messages.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">{t("emptyHint")}</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
              m.role === "user"
                ? "self-end bg-accent text-white"
                : "self-start bg-surface-elevated text-foreground",
            )}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 self-start rounded-2xl bg-surface-elevated px-3.5 py-2 text-sm text-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("thinking")}
          </div>
        )}
      </div>

      {recommendation && (
        <div className="flex flex-col gap-3 rounded-2xl border border-accent/40 bg-accent/5 p-4 sm:flex-row sm:items-center">
          {recommendation.preview_image_url && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recommendation.preview_image_url}
                alt={recommendation.title_ar}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-semibold">{recommendation.title_ar}</span>
            {recommendation.category && (
              <span className="w-fit rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-2">
                {recommendation.category}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleGenerateNow(recommendation)}
              className="accent-gradient-bg rounded-full px-4 py-2 text-xs font-medium text-white hover:opacity-90"
            >
              {t("generateNow")}
            </button>
            <button
              type="button"
              onClick={() => sendMessage(t("suggestAnotherMessage"))}
              className="rounded-full border border-accent px-4 py-2 text-xs font-medium text-accent-2 hover:bg-accent/10"
            >
              {t("suggestAnother")}
            </button>
          </div>
        </div>
      )}

      {fallbackAction === "enhancer" && (
        <a
          href={`/${locale}#enhancer`}
          className="flex w-fit items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-accent"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t("fallbackCta")}
        </a>
      )}

      {quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              type="button"
              onClick={() => sendMessage(qr)}
              className="rounded-full border border-border px-3.5 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent-2"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {messages.length === 0 && starterSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {starterSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => sendMessage(s)}
              className="rounded-full border border-border px-3.5 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent-2"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          maxLength={500}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="accent-gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          aria-label={t("send")}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

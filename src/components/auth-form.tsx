"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm({ totalGenerations }: { totalGenerations?: number }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const supabase = createSupabaseBrowserClient();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
      },
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const { error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { locale } },
          });

    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = `/${locale}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-surface p-8">
      <h1 className="text-xl font-semibold">
        {mode === "sign-in" ? t("signInTitle") : t("signUpTitle")}
      </h1>

      {!!totalGenerations && totalGenerations > 0 && (
        <p className="-mt-3 text-sm text-muted">
          {t("trustCopy", { count: totalGenerations })}
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        className="accent-gradient-bg flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        {t("continueWithGoogle")}
      </button>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        {t("orEmail")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent"
        />

        {message && <p className="text-sm text-red-400">{message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent disabled:opacity-50"
        >
          {t("submit")}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
        className="text-sm text-muted hover:text-foreground"
      >
        {mode === "sign-in" ? t("switchToSignUp") : t("switchToSignIn")}
      </button>
    </div>
  );
}

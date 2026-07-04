"use client";

import { useTranslations, useLocale } from "next-intl";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = `/${locale}`;
      }}
      className="w-fit rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent"
    >
      {t("signOut")}
    </button>
  );
}

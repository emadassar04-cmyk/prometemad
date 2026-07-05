"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getGuestFavorites } from "@/lib/guest-favorites";
import { PromptCard } from "@/components/prompt-card";
import type { Tables } from "@/lib/supabase/types";

type PromptWithCategory = Tables<"prompts"> & {
  categories: { slug: string; name_ar: string; name_en: string } | null;
};

export function GuestFavoritesList() {
  const t = useTranslations("favorites");
  const [prompts, setPrompts] = useState<PromptWithCategory[] | null>(null);

  useEffect(() => {
    async function load() {
      const ids = getGuestFavorites();
      if (ids.length === 0) {
        setPrompts([]);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("prompts")
        .select("*, categories(slug, name_ar, name_en)")
        .eq("status", "published")
        .in("id", ids);

      setPrompts(data ?? []);
    }

    void load();
  }, []);

  if (prompts === null) {
    return <p className="py-20 text-center text-muted">{t("loading")}</p>;
  }

  if (prompts.length === 0) {
    return <p className="py-20 text-center text-muted">{t("empty")}</p>;
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted">{t("guestNote")}</p>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isFavorited={true}
            isSignedIn={false}
          />
        ))}
      </div>
    </>
  );
}

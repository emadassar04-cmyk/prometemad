import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPromptsByTag } from "@/lib/data/prompts";
import { PromptCard } from "@/components/prompt-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nanoBanana" });
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  };
}

export default async function NanoBananaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const prompts = await getPromptsByTag("nano-banana");
  const t = await getTranslations("nanoBanana");

  let favoritedIds = new Set<string>();
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("prompt_id")
      .eq("user_id", user.id);
    favoritedIds = new Set((data ?? []).map((f) => f.prompt_id));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="mx-auto mb-4 inline-flex items-center rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-muted backdrop-blur">
          🍌 Nano Banana
        </span>
        <h1 className="mb-3 text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted">{t("subtitle")}</p>
        <p className="mt-4 text-sm text-muted">{t("howTo")}</p>
      </div>

      {prompts.length === 0 ? (
        <p className="py-20 text-center text-muted">{t("empty")}</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isFavorited={favoritedIds.has(prompt.id)}
              isSignedIn={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

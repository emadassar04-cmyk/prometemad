import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserFavoritePrompts } from "@/lib/data/user";
import { PromptCard } from "@/components/prompt-card";

export default async function FavoritesPage({
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

  if (!user) redirect({ href: "/sign-in", locale });

  const prompts = await getUserFavoritePrompts(user!.id);
  const t = await getTranslations("favorites");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {prompts.length === 0 ? (
        <p className="py-20 text-center text-muted">{t("empty")}</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isFavorited={true}
              isSignedIn={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getCategories,
  getDistinctStylesAndModels,
  getPrompts,
} from "@/lib/data/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PromptCard } from "@/components/prompt-card";
import { LibraryFilters } from "@/components/library-filters";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; style?: string; model?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = await searchParams;

  const t = await getTranslations("home");
  const brand = await getTranslations("brand");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [prompts, categories, { styles, models }] = await Promise.all([
    getPrompts(filters),
    getCategories(),
    getDistinctStylesAndModels(),
  ]);

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
      <section className="mb-10 text-center">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
          <span className="accent-gradient-text">{brand("name")}</span>
          {" — "}
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">{t("heroSubtitle")}</p>
      </section>

      <section className="mb-8">
        <LibraryFilters categories={categories} styles={styles} models={models} />
      </section>

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

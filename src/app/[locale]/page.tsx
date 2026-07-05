import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getCategories,
  getCategoriesWithCounts,
  getDistinctStylesAndModels,
  getPrompts,
} from "@/lib/data/prompts";
import { getTotalGenerationCount } from "@/lib/data/showcase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PromptCard } from "@/components/prompt-card";
import { LibraryFilters } from "@/components/library-filters";
import { CategoryGrid } from "@/components/category-grid";
import { PromptEnhancer } from "@/components/prompt-enhancer";

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

  const [
    prompts,
    categories,
    categoriesWithCounts,
    { styles, models },
    totalGenerations,
  ] = await Promise.all([
    getPrompts(filters),
    getCategories(),
    getCategoriesWithCounts(),
    getDistinctStylesAndModels(),
    getTotalGenerationCount(),
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
      <section className="relative mb-10 overflow-hidden px-4 py-6 text-center">
        <div className="hero-glow" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="mx-auto mb-5 inline-flex items-center rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-muted backdrop-blur">
          {t("badge")}
        </span>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
          <span className="accent-gradient-text">{brand("name")}</span>
          {" — "}
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">{t("heroSubtitle")}</p>

        <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <span>
            <span className="accent-gradient-text font-bold">
              {prompts.length}+
            </span>{" "}
            <span className="text-muted">{t("statPrompts")}</span>
          </span>
          <span className="hidden h-4 w-px bg-border sm:inline-block" />
          <span>
            <span className="accent-gradient-text font-bold">
              {categoriesWithCounts.length}
            </span>{" "}
            <span className="text-muted">{t("statCategories")}</span>
          </span>
          <span className="hidden h-4 w-px bg-border sm:inline-block" />
          <span>
            <span className="accent-gradient-text font-bold">10</span>{" "}
            <span className="text-muted">{t("statDailyLimit")}</span>
          </span>
          {totalGenerations > 0 && (
            <>
              <span className="hidden h-4 w-px bg-border sm:inline-block" />
              <span>
                <span className="accent-gradient-text font-bold">
                  {totalGenerations}+
                </span>{" "}
                <span className="text-muted">{t("statTotalGenerations")}</span>
              </span>
            </>
          )}
        </div>
      </section>

      <section className="mb-10">
        <PromptEnhancer isSignedIn={!!user} locale={locale} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-muted">
          {t("browseByCategory")}
        </h2>
        <CategoryGrid categories={categoriesWithCounts} activeSlug={filters.category} />
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

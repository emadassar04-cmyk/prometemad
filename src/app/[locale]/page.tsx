import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ImageIcon, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import {
  getCategories,
  getCategoriesWithCounts,
  getDistinctStylesAndModels,
  getPrompts,
} from "@/lib/data/prompts";
import { getTotalGenerationCount } from "@/lib/data/showcase";
import { getSiteSettings, pickSiteSetting, getActiveCampaigns } from "@/lib/data/site-settings";
import { getAssistantConfig } from "@/lib/data/feature-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { PromptCard } from "@/components/prompt-card";
import { LibraryFilters } from "@/components/library-filters";
import { CategoryGrid } from "@/components/category-grid";
import { PromptEnhancer } from "@/components/prompt-enhancer";
import { AssistantChat } from "@/components/assistant-chat";

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-center sm:text-start">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-text/10 text-brand-text sm:mx-0">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="accent-gradient-text mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    style?: string;
    model?: string;
    idea?: string;
  }>;
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
    siteSettings,
    activeCampaigns,
    assistantConfig,
  ] = await Promise.all([
    getPrompts(filters),
    getCategories(),
    getCategoriesWithCounts(),
    getDistinctStylesAndModels(),
    getTotalGenerationCount(),
    getSiteSettings(),
    getActiveCampaigns(),
    getAssistantConfig(),
  ]);

  let favoritedIds = new Set<string>();
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("prompt_id")
      .eq("user_id", user.id);
    favoritedIds = new Set((data ?? []).map((f) => f.prompt_id));
  }

  const heroPreviewImage = prompts.find((p) => p.preview_image_url)?.preview_image_url ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section className="mb-12 grid grid-cols-1 items-center gap-10 py-6 lg:grid-cols-2">
        <div className="text-center lg:text-start">
          <span className="mx-auto mb-5 inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted lg:mx-0">
            {pickSiteSetting(siteSettings, "hero_badge", locale, t("badge"))}
          </span>
          <h1 className="mx-auto max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:mx-0">
            <span className="accent-gradient-text">{brand("name")}</span>
            {" — "}
            {pickSiteSetting(siteSettings, "hero_title", locale, t("heroTitle"))}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted lg:mx-0">
            {pickSiteSetting(siteSettings, "hero_subtitle", locale, t("heroSubtitle"))}
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <a
              href="#library"
              className="accent-gradient-bg rounded-full px-7 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              {t("heroCta")}
            </a>
          </div>

          {activeCampaigns.length > 0 && (
            <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 lg:mx-0">
              {activeCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={
                    campaign.categories
                      ? `/?category=${campaign.categories.slug}`
                      : "/"
                  }
                  className="w-fit rounded-full border border-accent px-5 py-2 text-sm font-medium text-accent-2"
                >
                  🎉 {locale === "ar" ? campaign.name_ar : campaign.name_en}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface">
          {heroPreviewImage ? (
            <Image
              src={heroPreviewImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
              <ImageIcon className="h-10 w-10" />
              <span className="text-sm">{t("heroPreviewLabel")}</span>
            </div>
          )}
        </div>
      </section>

      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Sparkles} value={`${prompts.length}+`} label={t("statPrompts")} />
        <StatCard
          icon={LayoutGrid}
          value={categoriesWithCounts.length}
          label={t("statCategories")}
        />
        <StatCard icon={ImageIcon} value="10" label={t("statDailyLimit")} />
        {totalGenerations > 0 && (
          <StatCard
            icon={Wand2}
            value={`${totalGenerations}+`}
            label={t("statTotalGenerations")}
          />
        )}
      </section>

      {assistantConfig.is_enabled && (
        <AssistantChat
          isSignedIn={!!user}
          locale={locale}
          starterSuggestions={assistantConfig.starter_suggestions}
        />
      )}

      <section id="enhancer" className="-mx-4 mb-12 bg-navy px-4 py-14 text-white sm:-mx-6 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("enhancerSectionTitle")}</h2>
          <p className="mt-3 text-white/70">{t("enhancerSectionSubtitle")}</p>
        </div>
        <div className="mx-auto mt-8 max-w-xl">
          <PromptEnhancer isSignedIn={!!user} locale={locale} initialIdea={filters.idea} />
        </div>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs text-white/50">{t("enhancerBeforeLabel")}</p>
            <p className="mt-1">{t("enhancerBeforeExample")}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs text-white/50">{t("enhancerAfterLabel")}</p>
            <p className="mt-1">{t("enhancerAfterExample")}</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-muted">
          {t("browseByCategory")}
        </h2>
        <CategoryGrid categories={categoriesWithCounts} activeSlug={filters.category} />
      </section>

      <section id="library" className="mb-8 scroll-mt-24">
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

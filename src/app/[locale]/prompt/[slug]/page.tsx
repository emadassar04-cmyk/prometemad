import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getPromptBySlug,
  getPromptRatingSummary,
  getSimilarPrompts,
  getUserRatingForPrompt,
} from "@/lib/data/prompts";
import { getUserBrandKit } from "@/lib/data/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PromptWorkspace } from "@/components/prompt-workspace";
import { PromptCard } from "@/components/prompt-card";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return {};

  const title = locale === "ar" ? prompt.title_ar : prompt.title_en;
  const description =
    (locale === "ar" ? prompt.description_ar : prompt.description_en) ??
    undefined;
  const url = `${SITE_URL}/${locale}/prompt/${slug}`;
  const images = prompt.preview_image_url ? [prompt.preview_image_url] : [];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${SITE_URL}/ar/prompt/${slug}`,
        en: `${SITE_URL}/en/prompt/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function PromptDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const prefillValues: Record<string, string> = {};
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (!key.startsWith("var_") || typeof value !== "string") continue;
    prefillValues[key.slice("var_".length)] = value;
  }
  const assistantSessionRaw = resolvedSearchParams.assistant_session;
  const assistantSessionId = typeof assistantSessionRaw === "string" ? assistantSessionRaw : null;

  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavorited = false;
  let brandColors: string[] | null = null;
  let brandLogoUrl: string | null = null;
  let userRating: number | null = null;
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("prompt_id")
      .eq("user_id", user.id)
      .eq("prompt_id", prompt.id)
      .maybeSingle();
    isFavorited = !!data;

    const brandKit = await getUserBrandKit(user.id);
    const colors = Array.isArray(brandKit?.colors) ? brandKit.colors : [];
    if (colors.length > 0) brandColors = colors as string[];
    brandLogoUrl = brandKit?.logo_url ?? null;

    userRating = await getUserRatingForPrompt(user.id, prompt.id);
  }

  const ratingSummary = await getPromptRatingSummary(prompt.id);
  const similarPrompts = await getSimilarPrompts(prompt.category_id, prompt.id);

  let similarFavoritedIds = new Set<string>();
  if (user && similarPrompts.length > 0) {
    const { data } = await supabase
      .from("favorites")
      .select("prompt_id")
      .eq("user_id", user.id)
      .in(
        "prompt_id",
        similarPrompts.map((p) => p.id),
      );
    similarFavoritedIds = new Set((data ?? []).map((f) => f.prompt_id));
  }

  const t = await getTranslations("prompt");
  const title = locale === "ar" ? prompt.title_ar : prompt.title_en;
  const description = locale === "ar" ? prompt.description_ar : prompt.description_en;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: description ?? undefined,
    image: prompt.preview_image_url ?? undefined,
    url: `${SITE_URL}/${locale}/prompt/${slug}`,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromptWorkspace
        prompt={prompt}
        isFavorited={isFavorited}
        isSignedIn={!!user}
        brandColors={brandColors}
        brandLogoUrl={brandLogoUrl}
        ratingAverage={ratingSummary.average}
        ratingCount={ratingSummary.count}
        userRating={userRating}
        prefillValues={prefillValues}
        assistantSessionId={assistantSessionId}
      />

      {similarPrompts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-4 text-sm font-semibold text-muted">
            {t("similarPrompts")}
          </h2>
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {similarPrompts.map((similar) => (
              <PromptCard
                key={similar.id}
                prompt={similar}
                isFavorited={similarFavoritedIds.has(similar.id)}
                isSignedIn={!!user}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

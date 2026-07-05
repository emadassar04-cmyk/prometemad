import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategories, getPrompts } from "@/lib/data/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { PromptCard } from "@/components/prompt-card";
import { SITE_URL } from "@/lib/site-url";

// Dedicated per-category route (rather than a `?category=` filter on the
// homepage) so each category can rank on its own search-intent keyword,
// with its own canonical URL, metadata, and sitemap entry. Rendered
// per-request (like /prompt/[slug]) rather than statically, since the page
// body needs the visiting user's cookie-bound session for favorites.
async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const name = locale === "ar" ? category.name_ar : category.name_en;
  const t = await getTranslations({ locale, namespace: "categoryLanding" });
  const title = t("seoTitle", { name });
  const description = t("seoDescription", { name });
  const url = `${SITE_URL}/${locale}/prompts/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${SITE_URL}/ar/prompts/${slug}`,
        en: `${SITE_URL}/en/prompts/${slug}`,
      },
    },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const name = locale === "ar" ? category.name_ar : category.name_en;
  const [prompts, t] = await Promise.all([
    getPrompts({ category: slug }),
    getTranslations("categoryLanding"),
  ]);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        <h1 className="mb-3 text-3xl font-bold">{t("title", { name })}</h1>
        <p className="text-muted">{t("subtitle", { name })}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-accent-2 hover:text-accent"
        >
          {t("browseAll")}
        </Link>
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

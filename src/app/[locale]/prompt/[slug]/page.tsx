import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPromptBySlug } from "@/lib/data/prompts";
import { getUserBrandKit } from "@/lib/data/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PromptWorkspace } from "@/components/prompt-workspace";
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
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavorited = false;
  let brandColors: string[] | null = null;
  let brandLogoUrl: string | null = null;
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
  }

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
      />
    </>
  );
}

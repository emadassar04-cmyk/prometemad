import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActivePersonalStyles, getPersonalStyleBySlug } from "@/lib/data/personal-photos";
import { getUserReferralInfo } from "@/lib/data/user";
import { PersonalStyleDetailActions } from "@/components/personal-style-detail-actions";
import { categoryLabelKey } from "@/lib/personal-photos-shared";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const style = await getPersonalStyleBySlug(slug);
  if (!style) return {};

  const title = locale === "ar" ? style.title_ar : style.title_en;
  const description = style.tagline_ar;
  const url = `${SITE_URL}/${locale}/personal-photos/${slug}`;
  const ogImage = `${SITE_URL}/api/og?slug=${slug}&locale=${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${SITE_URL}/ar/personal-photos/${slug}`,
        en: `${SITE_URL}/en/personal-photos/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      images: [ogImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PersonalStyleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const style = await getPersonalStyleBySlug(slug);
  if (!style) notFound();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [allStyles, referralInfo] = await Promise.all([
    getActivePersonalStyles(),
    user ? getUserReferralInfo(user.id) : Promise.resolve(null),
  ]);

  const t = await getTranslations("personalPhotos");
  const referralCode = referralInfo?.referralCode ?? "3B91BA7C";
  const referralLink = `${SITE_URL}/${locale}/personal-photos?ref=${referralCode}#${slug}`;
  const title = locale === "ar" ? style.title_ar : style.title_en;

  const otherStyles = allStyles.filter((s) => s.slug !== slug).slice(0, 4);

  const imageObjectJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: style.example_after_url ?? undefined,
    name: title,
    description: style.tagline_ar,
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectJsonLd) }} />

      <Link href={`/${locale}/personal-photos`} className="text-sm text-muted hover:text-foreground">
        {t("backToStyles")}
      </Link>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-background">
        {style.example_after_url && (
          <Image
            src={style.example_after_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted">{style.tagline_ar}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">
            {t(categoryLabelKey(style.category) as Parameters<typeof t>[0])}
          </span>
          <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">
            {t("badgeGeminiPrompt")}
          </span>
          <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">{t("badgeNanoBanana")}</span>
        </div>
      </div>

      <PersonalStyleDetailActions
        styleId={style.id}
        promptBody={style.prompt_body}
        shareText={style.share_text_ar}
        shareUrl={referralLink}
      />

      {otherStyles.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="text-lg font-semibold">{t("otherStyles")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {otherStyles.map((s) => (
              <Link
                key={s.id}
                href={`/${locale}/personal-photos/${s.slug}`}
                className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-background"
              >
                {s.example_after_url && (
                  <Image
                    src={s.example_after_url}
                    alt={locale === "ar" ? s.title_ar : s.title_en}
                    fill
                    sizes="150px"
                    className="object-cover"
                    loading="lazy"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

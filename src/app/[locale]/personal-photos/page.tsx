import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActivePersonalStyles } from "@/lib/data/personal-photos";
import { getUserReferralInfo } from "@/lib/data/user";
import { PersonalPhotosTool } from "@/components/personal-photos-tool";
import { PersonalPhotosMarquee } from "@/components/personal-photos-marquee";
import { PersonalPhotosTimeline } from "@/components/personal-photos-timeline";
import { PersonalPhotosFaq } from "@/components/personal-photos-faq";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { SITE_URL } from "@/lib/site-url";

const OWNER_PHOTO_URL =
  "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/before.jpg";
const HERO_AFTER_URL =
  "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/old-money-after.png";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "personalPhotos" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PersonalPhotosPage({
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

  const [styles, referralInfo] = await Promise.all([
    getActivePersonalStyles(),
    user ? getUserReferralInfo(user.id) : Promise.resolve(null),
  ]);

  const t = await getTranslations("personalPhotos");
  // Falls back to the platform owner's own referral code for signed-out
  // visitors, matching the invite system's default elsewhere in the app.
  const referralCode = referralInfo?.referralCode ?? "3B91BA7C";
  const referralLink = `${SITE_URL}/${locale}/personal-photos?ref=${referralCode}`;

  const totalCopies = styles.reduce((sum, s) => sum + s.usage_count, 0);
  const marqueeItems = styles
    .filter((s) => s.example_after_url)
    .slice(0, 20)
    .map((s) => ({
      slug: s.slug,
      title: locale === "ar" ? s.title_ar : s.title_en,
      imageUrl: s.example_after_url as string,
    }));

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("title"),
    step: [
      { "@type": "HowToStep", text: t("howItWorksStep1") },
      { "@type": "HowToStep", text: t("howItWorksStep2") },
      { "@type": "HowToStep", text: t("howItWorksStep3") },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((i) => ({
      "@type": "Question",
      name: t(`faq${i}Q` as Parameters<typeof t>[0]),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${i}A` as Parameters<typeof t>[0]),
      },
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: styles.slice(0, 30).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: locale === "ar" ? s.title_ar : s.title_en,
      url: `${SITE_URL}/${locale}/personal-photos#${s.slug}`,
    })),
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold sm:text-4xl">{t("heroHeadline")}</h1>
          <span className="accent-gradient-bg shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {t("badgeNew")}
          </span>
        </div>
        <p className="max-w-2xl text-muted sm:text-lg">{t("heroTagline")}</p>

        <BeforeAfterSlider
          beforeUrl={OWNER_PHOTO_URL}
          afterUrl={HERO_AFTER_URL}
          beforeLabel={locale === "ar" ? "قبل" : "Before"}
          afterLabel={locale === "ar" ? "بعد" : "After"}
        />

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
          <span>{t("statStyles", { count: styles.length })}</span>
          <span aria-hidden>•</span>
          <span>{t("statFree")}</span>
          <span aria-hidden>•</span>
          <span>{t("statNoSignup")}</span>
          {totalCopies > 0 && (
            <>
              <span aria-hidden>•</span>
              <span>{t("statCopies", { count: totalCopies })}</span>
            </>
          )}
        </div>

        <a
          href="#grid"
          className="accent-gradient-bg rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          {t("heroCta")}
        </a>
      </section>

      <PersonalPhotosMarquee items={marqueeItems} />

      <PersonalPhotosTool locale={locale} styles={styles} referralLink={referralLink} />

      <PersonalPhotosTimeline referralLink={referralLink} />

      <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-bold">{t("closingTitle")}</h2>
        <p className="text-muted">{t("closingSubtitle")}</p>
        <a
          href="#grid"
          className="accent-gradient-bg rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          {t("closingCta")}
        </a>
      </section>

      <PersonalPhotosFaq />
    </div>
  );
}

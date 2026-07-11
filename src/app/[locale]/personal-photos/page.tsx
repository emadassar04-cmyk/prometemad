import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActivePersonalStyles } from "@/lib/data/personal-photos";
import { getUserReferralInfo } from "@/lib/data/user";
import { PersonalPhotosTool } from "@/components/personal-photos-tool";
import { SITE_URL } from "@/lib/site-url";

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
  const referralLink = `${SITE_URL}/${locale}?ref=${referralCode}`;

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <span className="accent-gradient-bg rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
          {t("badgeNew")}
        </span>
      </div>
      <p className="mb-6 text-muted">{t("subtitle")}</p>
      <PersonalPhotosTool locale={locale} styles={styles} referralLink={referralLink} />
    </div>
  );
}

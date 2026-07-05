import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserReferralInfo } from "@/lib/data/user";
import { InviteCard } from "@/components/invite-card";
import { SITE_URL } from "@/lib/site-url";

export default async function InvitePage({
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

  const { referralCode, referralCount } = await getUserReferralInfo(user!.id);
  const t = await getTranslations("invite");
  const referralLink = `${SITE_URL}/${locale}?ref=${referralCode}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("subtitle")}</p>
      <InviteCard referralLink={referralLink} referralCount={referralCount} />
    </div>
  );
}

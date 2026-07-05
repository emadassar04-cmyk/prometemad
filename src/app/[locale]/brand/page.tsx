import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserBrandKit, getUserBrandKitGenerations } from "@/lib/data/user";
import { BrandKitForm } from "@/components/brand-kit-form";

export default async function BrandPage({
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

  const [brandKit, brandGenerations] = await Promise.all([
    getUserBrandKit(user!.id),
    getUserBrandKitGenerations(user!.id),
  ]);
  const t = await getTranslations("brandKit");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("subtitle")}</p>
      <BrandKitForm initialBrandKit={brandKit} />

      <h2 className="mb-4 mt-10 text-xl font-bold">{t("resultsTitle")}</h2>
      {brandGenerations.length === 0 ? (
        <p className="text-muted">{t("resultsEmpty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {brandGenerations.map((generation) => (
            <Link
              key={generation.id}
              href={
                generation.prompts ? `/prompt/${generation.prompts.slug}` : "/"
              }
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface"
            >
              {generation.image_url && (
                <Image
                  src={generation.image_url}
                  alt={
                    locale === "ar"
                      ? (generation.prompts?.title_ar ?? "")
                      : (generation.prompts?.title_en ?? "")
                  }
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

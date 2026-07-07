import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserGenerations } from "@/lib/data/user";
import { ShowcaseToggle } from "@/components/showcase-toggle";
import { EmptyState } from "@/components/empty-state";

export default async function MyImagesPage({
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

  const generations = await getUserGenerations(user!.id);
  const t = await getTranslations("myImages");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {generations.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          message={t("empty")}
          ctaLabel={t("browseLibrary")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {generations.map((generation) => (
            <Link
              key={generation.id}
              href={
                generation.prompts
                  ? `/prompt/${generation.prompts.slug}`
                  : "/"
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
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute end-2 top-2">
                <ShowcaseToggle
                  generationId={generation.id}
                  initialIsPublic={generation.is_public}
                  initialModerationStatus={generation.moderation_status}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

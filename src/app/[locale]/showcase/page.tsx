import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getShowcaseGenerations } from "@/lib/data/showcase";
import { ShareButtons } from "@/components/share-buttons";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "showcase" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const generations = await getShowcaseGenerations();
  const t = await getTranslations("showcase");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("subtitle")}</p>

      {generations.length === 0 ? (
        <p className="py-20 text-center text-muted">{t("empty")}</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {generations.map((generation) => {
            const title = generation.prompts
              ? locale === "ar"
                ? generation.prompts.title_ar
                : generation.prompts.title_en
              : "";
            const promptUrl = generation.prompts
              ? `${SITE_URL}/${locale}/prompt/${generation.prompts.slug}`
              : SITE_URL;

            return (
              <div
                key={generation.id}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface"
              >
                {generation.image_url && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    {generation.prompts ? (
                      <Link
                        href={`/prompt/${generation.prompts.slug}`}
                        className="block h-full w-full"
                      >
                        <Image
                          src={generation.image_url}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                    ) : (
                      <Image
                        src={generation.image_url}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="truncate text-sm">{title}</span>
                  <ShareButtons url={promptUrl} text={title} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

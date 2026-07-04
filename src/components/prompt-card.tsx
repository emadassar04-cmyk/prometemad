import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import type { Tables } from "@/lib/supabase/types";

type PromptCardData = Tables<"prompts"> & {
  categories: { slug: string; name_ar: string; name_en: string } | null;
};

export function PromptCard({
  prompt,
  isFavorited,
  isSignedIn,
}: {
  prompt: PromptCardData;
  isFavorited: boolean;
  isSignedIn: boolean;
}) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("prompt");
  const title = locale === "ar" ? prompt.title_ar : prompt.title_en;
  const categoryName = prompt.categories
    ? locale === "ar"
      ? prompt.categories.name_ar
      : prompt.categories.name_en
    : null;

  return (
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_40px_-16px_rgb(212_175_55_/_0.35)]">
      <Link href={`/prompt/${prompt.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-elevated">
          {prompt.preview_image_url ? (
            <Image
              src={prompt.preview_image_url}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              {title}
            </div>
          )}
        </div>
      </Link>

      <div className="absolute end-3 top-3">
        <FavoriteButton
          promptId={prompt.id}
          initialFavorited={isFavorited}
          isSignedIn={isSignedIn}
        />
      </div>

      <div className="flex flex-col gap-1 p-4">
        {categoryName && (
          <span className="text-xs text-accent-2">{categoryName}</span>
        )}
        <Link href={`/prompt/${prompt.slug}`} className="font-medium hover:text-accent">
          {title}
        </Link>
        {prompt.generation_count > 0 && (
          <span className="text-xs text-muted">
            {t("usedCount", { count: prompt.generation_count })}
          </span>
        )}
      </div>
    </div>
  );
}

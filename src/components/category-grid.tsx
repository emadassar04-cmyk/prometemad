import {
  Calendar,
  Layout,
  Megaphone,
  Package,
  Palette,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ICONS: Record<string, LucideIcon> = {
  package: Package,
  megaphone: Megaphone,
  sparkles: Sparkles,
  user: User,
  palette: Palette,
  layout: Layout,
  calendar: Calendar,
};

type CategoryWithCount = {
  slug: string;
  name_ar: string;
  name_en: string;
  icon: string | null;
  promptCount: number;
};

export function CategoryGrid({
  categories,
  activeSlug,
}: {
  categories: CategoryWithCount[];
  activeSlug?: string;
}) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("home");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => {
        const Icon = (category.icon && ICONS[category.icon]) || Sparkles;
        const isActive = category.slug === activeSlug;
        const name = locale === "ar" ? category.name_ar : category.name_en;

        return (
          <Link
            key={category.slug}
            href={isActive ? "/" : `/?category=${category.slug}`}
            className={`group flex flex-col gap-2 rounded-2xl border p-4 transition-colors ${
              isActive
                ? "border-accent bg-surface-elevated"
                : "border-border bg-surface hover:border-accent"
            }`}
          >
            <div className="accent-gradient-bg flex h-9 w-9 items-center justify-center rounded-full">
              <Icon className="h-4.5 w-4.5 text-navy" />
            </div>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted">
                {t("categoryCount", { count: category.promptCount })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

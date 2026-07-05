import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/data/admin";
import { getSiteSettings } from "@/lib/data/site-settings";
import { saveSiteSettingsAction } from "./actions";

const FIELDS: { key: string; labelAr: string; labelEn: string }[] = [
  { key: "hero_badge", labelAr: "الشارة فوق العنوان", labelEn: "Badge above title" },
  { key: "hero_title", labelAr: "العنوان الرئيسي", labelEn: "Hero title" },
  { key: "hero_subtitle", labelAr: "العنوان الفرعي", labelEn: "Hero subtitle" },
  { key: "seo_title", labelAr: "عنوان SEO", labelEn: "SEO title" },
  { key: "seo_description", labelAr: "وصف SEO", labelEn: "SEO description" },
];

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const settings = await getSiteSettings();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("content")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      <form action={saveSiteSettingsAction} className="flex flex-col gap-6">
        <input type="hidden" name="locale" value={locale} />
        {FIELDS.map((field) => (
          <div
            key={field.key}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <p className="mb-3 text-sm font-semibold text-muted">
              {field.labelAr} / {field.labelEn}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <textarea
                name={`${field.key}_ar`}
                defaultValue={settings[field.key]?.value_ar ?? ""}
                rows={2}
                dir="rtl"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <textarea
                name={`${field.key}_en`}
                defaultValue={settings[field.key]?.value_en ?? ""}
                rows={2}
                dir="ltr"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="accent-gradient-bg w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}

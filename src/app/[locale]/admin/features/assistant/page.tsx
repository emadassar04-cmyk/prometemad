import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getAssistantStats } from "@/lib/data/admin";
import { getAssistantConfig } from "@/lib/data/feature-settings";
import { saveAssistantConfigAction } from "./actions";

export default async function AdminAssistantFeaturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const [config, stats] = await Promise.all([getAssistantConfig(), getAssistantStats()]);
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">إعدادات المساعد الذكي</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted">عدد المحادثات</p>
          <p className="mt-1 text-2xl font-bold">{stats.total_conversations}</p>
        </div>
        <div>
          <p className="text-xs text-muted">محادثات أدّت لتوليد صورة</p>
          <p className="mt-1 text-2xl font-bold">{stats.conversions}</p>
        </div>
        <div>
          <p className="text-xs text-muted">نسبة التحويل</p>
          <p className="mt-1 text-2xl font-bold">{(stats.conversion_rate * 100).toFixed(0)}%</p>
        </div>
      </div>

      <form action={saveAssistantConfigAction} className="flex flex-col gap-6">
        <input type="hidden" name="locale" value={locale} />

        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
          <div>
            <p className="text-sm font-semibold">تفعيل المساعد</p>
            <p className="mt-1 text-xs text-muted">
              لو متوقف، ما هيظهرش زرار المساعد في الصفحة الرئيسية إطلاقًا.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="is_enabled"
              defaultChecked={config.is_enabled}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-accent" />
            <div className="absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <label className="mb-2 block text-sm font-semibold text-muted">
              الحد اليومي لكل مستخدم
            </label>
            <input
              type="number"
              name="daily_limit"
              min={0}
              defaultValue={config.daily_limit}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <label className="mb-2 block text-sm font-semibold text-muted">
              أقصى عدد أسئلة توضيحية
            </label>
            <input
              type="number"
              name="max_questions"
              min={0}
              defaultValue={config.max_questions}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <label className="mb-2 block text-sm font-semibold text-muted">
            تعليمات المساعد (system prompt)
          </label>
          <textarea
            name="system_prompt"
            defaultValue={config.system_prompt}
            rows={10}
            dir="rtl"
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-accent"
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <label className="mb-2 block text-sm font-semibold text-muted">
            الاقتراحات الجاهزة (سطر لكل اقتراح)
          </label>
          <textarea
            name="starter_suggestions"
            defaultValue={config.starter_suggestions.join("\n")}
            rows={4}
            dir="rtl"
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="accent-gradient-bg w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white"
        >
          {t("save")}
        </button>
      </form>

      {stats.top_recommended.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-sm font-semibold text-muted">أكثر البرومبتات ترشيحًا</h2>
          <ol className="flex flex-col gap-2 text-sm">
            {stats.top_recommended.map((p, i) => (
              <li key={p.slug} className="flex items-center justify-between">
                <span>
                  <span className="text-muted">{i + 1}.</span>{" "}
                  {locale === "ar" ? p.title_ar : p.title_en}
                </span>
                <span className="font-semibold">{p.count}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

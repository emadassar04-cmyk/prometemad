import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageIcon, Sparkles, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getAdminStats } from "@/lib/data/admin";
import { DailyGenerationsChart } from "@/components/admin/daily-generations-chart";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const stats = await getAdminStats();
  const t = await getTranslations("admin");
  const isAr = locale === "ar";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/categories"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
          >
            {t("categories")}
          </Link>
          <Link
            href="/admin/prompts"
            className="accent-gradient-bg rounded-full px-4 py-2 text-sm font-medium text-white"
          >
            {t("prompts")}
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Sparkles}
          label={t("totalPrompts")}
          value={stats.total_prompts}
        />
        <StatCard
          icon={ImageIcon}
          label={t("totalGenerations")}
          value={stats.total_generations}
        />
        <StatCard icon={Users} label={t("totalUsers")} value={stats.total_users} />
      </div>

      <div className="mb-6">
        <DailyGenerationsChart data={stats.daily_generations} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-sm font-semibold text-muted">
            أعلى 10 برومبتات استخدامًا
          </h2>
          <ol className="flex flex-col gap-2 text-sm">
            {stats.top_prompts.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between">
                <span>
                  <span className="text-muted">{i + 1}.</span>{" "}
                  {isAr ? p.title_ar : p.title_en}
                </span>
                <span className="font-semibold">{p.generation_count}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-sm font-semibold text-muted">
            أعلى الفئات استخدامًا
          </h2>
          <ol className="flex flex-col gap-2 text-sm">
            {stats.top_categories.map((c, i) => (
              <li key={c.name_en} className="flex items-center justify-between">
                <span>
                  <span className="text-muted">{i + 1}.</span>{" "}
                  {isAr ? c.name_ar : c.name_en}
                </span>
                <span className="font-semibold">{c.total_generations}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="accent-gradient-bg mb-4 flex h-10 w-10 items-center justify-center rounded-full">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

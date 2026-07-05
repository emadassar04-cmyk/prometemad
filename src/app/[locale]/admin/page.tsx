import { getTranslations, setRequestLocale } from "next-intl/server";
import { ImageIcon, Sparkles, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getAdminStats } from "@/lib/data/admin";

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Sparkles}
          label={t("totalPrompts")}
          value={stats.totalPrompts}
        />
        <StatCard
          icon={ImageIcon}
          label={t("totalGenerations")}
          value={stats.totalGenerations}
        />
        <StatCard icon={Users} label={t("totalUsers")} value={stats.totalUsers} />
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

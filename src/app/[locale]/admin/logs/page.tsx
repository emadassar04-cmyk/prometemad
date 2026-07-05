import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  requireAdmin,
  getRecentFailedGenerations,
  getGenerationVolumeToday,
} from "@/lib/data/admin";

export default async function AdminLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const [failed, volume] = await Promise.all([
    getRecentFailedGenerations(),
    getGenerationVolumeToday(),
  ]);
  const t = await getTranslations("admin");
  const isAr = locale === "ar";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("logs")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold">{volume.succeeded}</p>
          <p className="text-sm text-muted">{t("logsSucceededToday")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{volume.failed}</p>
          <p className="text-sm text-muted">{t("logsFailedToday")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold">{volume.pending}</p>
          <p className="text-sm text-muted">{t("logsPendingToday")}</p>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-muted">
        {t("logsRecentFailures")}
      </h2>
      {failed.length === 0 ? (
        <p className="py-10 text-center text-muted">{t("logsEmpty")}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {failed.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-0">
                  <td className="p-4 text-muted">
                    {new Date(g.created_at).toLocaleString(locale)}
                  </td>
                  <td className="p-4">
                    {g.prompts ? (isAr ? g.prompts.title_ar : g.prompts.title_en) : "—"}
                  </td>
                  <td className="p-4 text-muted">{g.model ?? "—"}</td>
                  <td className="p-4 text-red-400">{g.error ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

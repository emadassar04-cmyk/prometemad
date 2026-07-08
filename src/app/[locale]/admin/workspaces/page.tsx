import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getPendingWorkspaceRequests } from "@/lib/data/admin";
import { approveWorkspaceAction, rejectWorkspaceAction } from "./actions";

export default async function AdminWorkspacesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const pending = await getPendingWorkspaceRequests();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("workspaces")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      {pending.length === 0 ? (
        <p className="py-20 text-center text-muted">{t("workspacesEmpty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pending.map((w) => (
            <div
              key={w.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{w.name}</p>
                <p className="text-sm text-muted">
                  {w.profiles?.username ?? w.owner_id}
                </p>
              </div>
              <div className="flex gap-3">
                <form action={approveWorkspaceAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="id" value={w.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-navy"
                  >
                    {t("moderationApprove")}
                  </button>
                </form>
                <form action={rejectWorkspaceAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="id" value={w.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-400 px-4 py-2 text-sm font-medium text-red-400"
                  >
                    {t("moderationReject")}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

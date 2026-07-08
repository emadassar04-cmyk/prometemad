import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWorkspaceInfo } from "@/lib/data/user";
import { WorkspaceInviteCard } from "@/components/workspace-invite-card";
import { requestWorkspaceAction, joinWorkspaceAction, leaveWorkspaceAction } from "./actions";

export default async function WorkspacePage({
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

  const info = await getUserWorkspaceInfo(user!.id);
  const t = await getTranslations("workspace");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("subtitle")}</p>

      {info.status === "member" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-1 text-lg font-semibold">{info.name}</h2>
            <p className="mb-4 text-sm text-muted">
              {t("quotaUsage", { used: info.usedToday, limit: info.pooledLimit })}
            </p>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="accent-gradient-bg h-full"
                style={{
                  width: `${Math.min(100, (info.usedToday / Math.max(info.pooledLimit, 1)) * 100)}%`,
                }}
              />
            </div>

            <p className="mb-2 text-sm font-medium">{t("membersTitle")}</p>
            <ul className="mb-4 flex flex-col gap-1 text-sm text-muted">
              {info.members.map((m, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    {m.username ?? t("unnamedMember")}
                    {m.role === "owner" && ` (${t("owner")})`}
                  </span>
                  <span>{m.dailyLimit}</span>
                </li>
              ))}
            </ul>

            {info.role === "owner" && (
              <>
                <p className="mb-2 text-sm font-medium">{t("inviteTitle")}</p>
                <WorkspaceInviteCard inviteCode={info.inviteCode} />
              </>
            )}
          </div>

          {info.role === "member" && (
            <form action={leaveWorkspaceAction}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="rounded-full border border-red-400 px-4 py-2 text-sm font-medium text-red-400"
              >
                {t("leave")}
              </button>
            </form>
          )}
        </div>
      )}

      {info.status === "pending" && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-medium">{info.name}</p>
          <p className="mt-1 text-sm text-muted">{t("pendingNotice")}</p>
        </div>
      )}

      {(info.status === "none" || info.status === "rejected") && (
        <div className="flex flex-col gap-6">
          {info.status === "rejected" && (
            <div className="rounded-2xl border border-red-400/40 bg-surface p-4 text-sm text-red-400">
              {t("rejectedNotice", { name: info.name })}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-lg font-semibold">{t("requestTitle")}</h2>
            <p className="mb-4 text-sm text-muted">{t("requestExplanation")}</p>
            <form action={requestWorkspaceAction} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="locale" value={locale} />
              <input
                type="text"
                name="name"
                required
                placeholder={t("namePlaceholder")}
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="accent-gradient-bg rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {t("submitRequest")}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-lg font-semibold">{t("joinTitle")}</h2>
            <p className="mb-4 text-sm text-muted">{t("joinExplanation")}</p>
            <form action={joinWorkspaceAction} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="locale" value={locale} />
              <input
                type="text"
                name="inviteCode"
                required
                placeholder={t("codePlaceholder")}
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-center text-sm font-mono tracking-widest outline-none"
              />
              <button
                type="submit"
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-accent"
              >
                {t("submitJoin")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getAdminUsers } from "@/lib/data/admin";
import { toggleBanAction, toggleAdminAction, setDailyLimitAction } from "./actions";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user: currentUser } = await requireAdmin(locale);

  const users = await getAdminUsers();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("users")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-start text-muted">
              <th className="p-4 text-start">{t("userEmail")}</th>
              <th className="p-4 text-start">{t("userJoined")}</th>
              <th className="p-4 text-start">{t("userLastSignIn")}</th>
              <th className="p-4 text-start">{t("userGenerations")}</th>
              <th className="p-4 text-start">{t("userDailyLimit")}</th>
              <th className="p-4 text-end">—</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-4">
                  <p className="font-medium">{u.email}</p>
                  <p className="text-muted">
                    {u.role === "admin" ? "admin" : null}
                    {u.is_banned ? ` · ${t("userBanned")}` : null}
                  </p>
                </td>
                <td className="p-4 text-muted">
                  {new Date(u.created_at).toLocaleDateString(locale)}
                </td>
                <td className="p-4 text-muted">
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleDateString(locale)
                    : t("never")}
                </td>
                <td className="p-4 text-muted">
                  {u.generations_today} / {u.total_generations}
                </td>
                <td className="p-4">
                  <form action={setDailyLimitAction} className="flex items-center gap-2">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="id" value={u.id} />
                    <input
                      type="number"
                      name="daily_limit_override"
                      min={0}
                      defaultValue={u.daily_limit_override ?? ""}
                      placeholder={t("userDailyLimitPlaceholder")}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-accent"
                    />
                    <button
                      type="submit"
                      className="text-xs text-accent-2 hover:text-accent"
                    >
                      {t("save")}
                    </button>
                  </form>
                </td>
                <td className="p-4 text-end">
                  <div className="flex justify-end gap-3">
                    <form action={toggleBanAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="id" value={u.id} />
                      <input
                        type="hidden"
                        name="is_banned"
                        value={String(u.is_banned)}
                      />
                      <button
                        type="submit"
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        {u.is_banned ? t("userUnban") : t("userBan")}
                      </button>
                    </form>
                    {u.id !== currentUser.id && (
                      <form action={toggleAdminAction}>
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="role" value={u.role} />
                        <button
                          type="submit"
                          className="text-sm text-accent-2 hover:text-accent"
                        >
                          {u.role === "admin"
                            ? t("userRevokeAdmin")
                            : t("userMakeAdmin")}
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

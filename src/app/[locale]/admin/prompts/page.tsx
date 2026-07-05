import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getAllPromptsForAdmin } from "@/lib/data/admin";
import { deletePromptAction } from "./actions";

export default async function AdminPromptsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const prompts = await getAllPromptsForAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("prompts")}</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/categories"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
          >
            {t("categories")}
          </Link>
          <Link
            href="/admin/prompts/new"
            className="accent-gradient-bg rounded-full px-4 py-2 text-sm font-medium text-white"
          >
            {t("newPrompt")}
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.id} className="border-b border-border last:border-0">
                <td className="p-4">
                  <p className="font-medium">{prompt.title_ar}</p>
                  <p className="text-muted">{prompt.title_en}</p>
                </td>
                <td className="p-4 text-muted">{prompt.status}</td>
                <td className="p-4 text-end">
                  <Link
                    href={`/admin/prompts/${prompt.id}`}
                    className="me-4 text-accent-2 hover:text-accent"
                  >
                    {t("edit")}
                  </Link>
                  <form action={deletePromptAction} className="inline">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="id" value={prompt.id} />
                    <button type="submit" className="text-red-400 hover:text-red-300">
                      {t("delete")}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

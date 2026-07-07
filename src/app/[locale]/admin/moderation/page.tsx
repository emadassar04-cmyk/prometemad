import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getPendingModerationGenerations } from "@/lib/data/admin";
import { approveGenerationAction, rejectGenerationAction } from "./actions";

export default async function AdminModerationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const pending = await getPendingModerationGenerations();
  const t = await getTranslations("admin");
  const isAr = locale === "ar";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("moderation")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      {pending.length === 0 ? (
        <p className="py-20 text-center text-muted">{t("moderationEmpty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((g) => (
            <div
              key={g.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                {g.image_url && (
                  <Image
                    src={g.image_url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-muted">
                {g.prompts ? (isAr ? g.prompts.title_ar : g.prompts.title_en) : "—"}
              </p>
              <div className="flex gap-3">
                <form action={approveGenerationAction} className="flex-1">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="id" value={g.id} />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-navy"
                  >
                    {t("moderationApprove")}
                  </button>
                </form>
                <form action={rejectGenerationAction} className="flex-1">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="id" value={g.id} />
                  <button
                    type="submit"
                    className="w-full rounded-full border border-red-400 px-4 py-2 text-sm font-medium text-red-400"
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

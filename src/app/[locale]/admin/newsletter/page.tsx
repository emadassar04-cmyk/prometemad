import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getSubscribers } from "@/lib/data/admin";
import { NewsletterComposer } from "@/components/admin/newsletter-composer";

export default async function AdminNewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const subscribers = await getSubscribers();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("newsletter")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      <p className="mb-8 text-sm text-muted">
        {t("newsletterSubscriberCount", { count: subscribers.length })}
      </p>

      <NewsletterComposer />

      <div className="mt-10 flex flex-col gap-2">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
          >
            <span>{subscriber.email}</span>
            <span className="text-xs text-muted">
              {new Date(subscriber.subscribed_at).toLocaleDateString(locale)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

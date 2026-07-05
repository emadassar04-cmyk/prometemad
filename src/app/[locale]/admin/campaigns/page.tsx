import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin, getAllCampaigns } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/prompts";
import { saveCampaignAction, deleteCampaignAction } from "./actions";

export default async function AdminCampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const [campaigns, categories] = await Promise.all([
    getAllCampaigns(),
    getCategories(),
  ]);
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("campaigns")}</h1>
        <Link
          href="/admin"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          {t("title")}
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted">
          {t("newCampaign")}
        </h2>
        <form
          action={saveCampaignAction}
          className="grid grid-cols-2 gap-3 sm:grid-cols-5"
        >
          <input type="hidden" name="locale" value={locale} />
          <CampaignFields categories={categories} />
          <button
            type="submit"
            className="accent-gradient-bg rounded-lg px-4 py-2 text-sm font-medium text-white sm:col-span-5 sm:w-fit"
          >
            {t("save")}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {campaigns.map((campaign) => (
          <form
            key={campaign.id}
            action={saveCampaignAction}
            className="grid grid-cols-2 items-end gap-3 rounded-2xl border border-border p-4 sm:grid-cols-6"
          >
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={campaign.id} />
            <CampaignFields categories={categories} campaign={campaign} />
            <div className="flex gap-3 sm:col-span-1">
              <button type="submit" className="text-sm text-accent-2 hover:text-accent">
                {t("save")}
              </button>
              <button
                type="submit"
                formAction={deleteCampaignAction}
                className="text-sm text-red-400 hover:text-red-300"
              >
                {t("delete")}
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function CampaignFields({
  categories,
  campaign,
}: {
  categories: { id: string; name_ar: string; name_en: string }[];
  campaign?: {
    name_ar: string;
    name_en: string;
    category_id: string | null;
    start_date: string;
    end_date: string;
  };
}) {
  return (
    <>
      <input
        type="text"
        name="name_ar"
        defaultValue={campaign?.name_ar}
        placeholder="اسم الحملة (عربي)"
        required
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        type="text"
        name="name_en"
        defaultValue={campaign?.name_en}
        placeholder="Campaign name (EN)"
        required
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <select
        name="category_id"
        defaultValue={campaign?.category_id ?? ""}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      >
        <option value="">—</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name_ar} / {c.name_en}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="start_date"
        defaultValue={campaign?.start_date}
        required
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        type="date"
        name="end_date"
        defaultValue={campaign?.end_date}
        required
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </>
  );
}

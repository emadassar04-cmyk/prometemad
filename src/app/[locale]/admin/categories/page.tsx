import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/prompts";
import { saveCategoryAction, deleteCategoryAction } from "./actions";

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const categories = await getCategories();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("categories")}</h1>
        <Link
          href="/admin/prompts"
          className="text-sm text-accent-2 hover:text-accent"
        >
          {t("prompts")}
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted">
          {t("newCategory")}
        </h2>
        <form
          action={saveCategoryAction}
          className="grid grid-cols-2 gap-3 sm:grid-cols-5"
        >
          <input type="hidden" name="locale" value={locale} />
          <CategoryFields />
          <button
            type="submit"
            className="accent-gradient-bg rounded-lg px-4 py-2 text-sm font-medium text-white sm:col-span-5 sm:w-fit"
          >
            {t("save")}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <form
            key={category.id}
            action={saveCategoryAction}
            className="grid grid-cols-2 items-end gap-3 rounded-2xl border border-border p-4 sm:grid-cols-6"
          >
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={category.id} />
            <CategoryFields category={category} />
            <div className="flex gap-3 sm:col-span-1">
              <button
                type="submit"
                className="text-sm text-accent-2 hover:text-accent"
              >
                {t("save")}
              </button>
              <button
                type="submit"
                formAction={deleteCategoryAction}
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

function CategoryFields({
  category,
}: {
  category?: {
    slug: string;
    name_ar: string;
    name_en: string;
    icon: string | null;
    sort_order: number;
  };
}) {
  return (
    <>
      <LabeledInput name="slug" defaultValue={category?.slug} placeholder="slug" />
      <LabeledInput name="name_ar" defaultValue={category?.name_ar} placeholder="اسم عربي" />
      <LabeledInput name="name_en" defaultValue={category?.name_en} placeholder="English name" />
      <LabeledInput name="icon" defaultValue={category?.icon ?? ""} placeholder="icon" />
      <LabeledInput
        name="sort_order"
        type="number"
        defaultValue={String(category?.sort_order ?? 0)}
        placeholder="0"
      />
    </>
  );
}

function LabeledInput({
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={name === "slug" || name === "name_ar" || name === "name_en"}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
    />
  );
}

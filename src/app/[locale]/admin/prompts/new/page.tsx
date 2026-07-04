import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/prompts";
import { PromptForm } from "@/components/admin/prompt-form";

export default async function NewPromptPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">New Prompt</h1>
      <PromptForm locale={locale} categories={categories} />
    </div>
  );
}

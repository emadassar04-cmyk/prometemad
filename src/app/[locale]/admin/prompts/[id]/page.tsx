import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { requireAdmin, getPromptForAdmin } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/prompts";
import { PromptForm } from "@/components/admin/prompt-form";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const [prompt, categories] = await Promise.all([
    getPromptForAdmin(id),
    getCategories(),
  ]);

  if (!prompt) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Prompt</h1>
      <PromptForm locale={locale} prompt={prompt} categories={categories} />
    </div>
  );
}

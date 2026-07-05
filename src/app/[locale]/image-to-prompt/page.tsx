import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ImageToPromptTool } from "@/components/image-to-prompt-tool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageToPrompt" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ImageToPromptPage({
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

  const t = await getTranslations("imageToPrompt");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("subtitle")}</p>
      <ImageToPromptTool isSignedIn={!!user} locale={locale} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPromptBySlug } from "@/lib/data/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PromptWorkspace } from "@/components/prompt-workspace";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavorited = false;
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("prompt_id")
      .eq("user_id", user.id)
      .eq("prompt_id", prompt.id)
      .maybeSingle();
    isFavorited = !!data;
  }

  return (
    <PromptWorkspace
      prompt={prompt}
      isFavorited={isFavorited}
      isSignedIn={!!user}
    />
  );
}

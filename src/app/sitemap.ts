import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabasePublicClient();
  const { data: prompts } = await supabase
    .from("prompts")
    .select("slug, created_at")
    .eq("status", "published");

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      changeFrequency: "daily",
      priority: 1,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/showcase`,
      changeFrequency: "daily",
      priority: 0.6,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/image-to-prompt`,
      changeFrequency: "monthly",
      priority: 0.9,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/nano-banana`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    for (const prompt of prompts ?? []) {
      entries.push({
        url: `${SITE_URL}/${locale}/prompt/${prompt.slug}`,
        lastModified: prompt.created_at,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}

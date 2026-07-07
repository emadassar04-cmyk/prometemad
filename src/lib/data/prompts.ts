import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parsePromptVariables } from "@/lib/prompt-variables";

export type PromptListFilters = {
  q?: string;
  category?: string;
  style?: string;
  model?: string;
};

export async function getCategories() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getCategoriesWithCounts() {
  const supabase = await createSupabaseServerClient();
  const [{ data: categories }, { data: promptRows }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("prompts").select("category_id").eq("status", "published"),
  ]);

  const counts = new Map<string, number>();
  for (const row of promptRows ?? []) {
    if (!row.category_id) continue;
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return (categories ?? []).map((category) => ({
    ...category,
    promptCount: counts.get(category.id) ?? 0,
  }));
}

export async function getPrompts(filters: PromptListFilters = {}) {
  const supabase = await createSupabaseServerClient();

  let categoryId: string | null = null;
  if (filters.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    categoryId = category?.id ?? null;
  }

  const term = filters.q?.trim();

  if (!term) {
    let query = supabase
      .from("prompts")
      .select("*, categories(slug, name_ar, name_en)")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (categoryId) query = query.eq("category_id", categoryId);
    if (filters.style) query = query.eq("style", filters.style);
    if (filters.model) query = query.eq("model", filters.model);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  // Full-text search using the indexed tsvector columns instead of ilike
  // scans. The English and Arabic columns each use their own dictionary, so
  // a single filter can't OR across both — run them as parallel queries
  // (plus a tag containment check) and merge the results in memory.
  const buildSearchQuery = () => {
    let query = supabase
      .from("prompts")
      .select("*, categories(slug, name_ar, name_en)")
      .eq("status", "published");
    if (categoryId) query = query.eq("category_id", categoryId);
    if (filters.style) query = query.eq("style", filters.style);
    if (filters.model) query = query.eq("model", filters.model);
    return query;
  };

  const [enResult, arResult, tagResult] = await Promise.all([
    buildSearchQuery().textSearch("search_vector_en", term, {
      type: "websearch",
      config: "english",
    }),
    buildSearchQuery().textSearch("search_vector_ar", term, {
      type: "websearch",
      config: "arabic",
    }),
    buildSearchQuery().contains("tags", [term]),
  ]);

  if (enResult.error) throw enResult.error;
  if (arResult.error) throw arResult.error;
  if (tagResult.error) throw tagResult.error;

  const merged = new Map<string, NonNullable<typeof enResult.data>[number]>();
  for (const row of [
    ...(enResult.data ?? []),
    ...(arResult.data ?? []),
    ...(tagResult.data ?? []),
  ]) {
    merged.set(row.id, row);
  }

  return [...merged.values()].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function getPromptsByTag(tag: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, categories(slug, name_ar, name_en)")
    .eq("status", "published")
    .contains("tags", [tag])
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

// "Similar prompts" row on the prompt detail page — same category,
// published, excluding the prompt being viewed.
export async function getSimilarPrompts(
  categoryId: string | null,
  excludeId: string,
  limit = 4,
) {
  if (!categoryId) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompts")
    .select("*, categories(slug, name_ar, name_en)")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export type PromptIndexEntry = {
  slug: string;
  title_ar: string;
  description_ar: string | null;
  category: string | null;
  preview_image_url: string | null;
  variables: ReturnType<typeof parsePromptVariables>;
};

// Compact per-prompt shape sent to the assistant's LLM call — just enough
// for it to pick a slug and fill variables, not the full row.
export async function getPublishedPromptsIndex(): Promise<PromptIndexEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompts")
    .select("slug, title_ar, description_ar, preview_image_url, variables, categories(name_ar)")
    .eq("status", "published");

  return (data ?? []).map((row) => ({
    slug: row.slug,
    title_ar: row.title_ar,
    description_ar: row.description_ar,
    category: row.categories?.name_ar ?? null,
    preview_image_url: row.preview_image_url,
    variables: parsePromptVariables(row.variables),
  }));
}

export const getPromptBySlug = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*, categories(slug, name_ar, name_en)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
});

export async function getPromptRatingSummary(promptId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompt_ratings")
    .select("rating")
    .eq("prompt_id", promptId);

  const ratings = data ?? [];
  const count = ratings.length;
  const average =
    count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return { average, count };
}

export async function getUserRatingForPrompt(userId: string, promptId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompt_ratings")
    .select("rating")
    .eq("user_id", userId)
    .eq("prompt_id", promptId)
    .maybeSingle();
  return data?.rating ?? null;
}

export async function getDistinctStylesAndModels() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("prompts")
    .select("style, model")
    .eq("status", "published");

  const styles = new Set<string>();
  const models = new Set<string>();
  for (const row of data ?? []) {
    if (row.style) styles.add(row.style);
    if (row.model) models.add(row.model);
  }
  return { styles: [...styles], models: [...models] };
}

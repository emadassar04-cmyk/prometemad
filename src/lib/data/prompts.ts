import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function getPrompts(filters: PromptListFilters = {}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("prompts")
    .select("*, categories(slug, name_ar, name_en)")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (category) query = query.eq("category_id", category.id);
  }

  if (filters.style) query = query.eq("style", filters.style);
  if (filters.model) query = query.eq("model", filters.model);

  if (filters.q?.trim()) {
    const term = filters.q.trim();
    query = query.or(
      `title_ar.ilike.%${term}%,title_en.ilike.%${term}%,tags.cs.{${term}}`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPromptBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*, categories(slug, name_ar, name_en)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
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

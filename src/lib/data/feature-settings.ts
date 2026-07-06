import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AssistantConfig = {
  is_enabled: boolean;
  daily_limit: number;
  max_questions: number;
  system_prompt: string;
  starter_suggestions: string[];
};

const ASSISTANT_DEFAULTS: AssistantConfig = {
  is_enabled: false,
  daily_limit: 20,
  max_questions: 2,
  system_prompt: "",
  starter_suggestions: [],
};

export async function getAssistantConfig(): Promise<AssistantConfig> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("feature_settings")
    .select("config")
    .eq("key", "assistant")
    .maybeSingle();

  const config = (data?.config ?? {}) as Partial<AssistantConfig>;
  return {
    is_enabled: config.is_enabled ?? ASSISTANT_DEFAULTS.is_enabled,
    daily_limit: config.daily_limit ?? ASSISTANT_DEFAULTS.daily_limit,
    max_questions: config.max_questions ?? ASSISTANT_DEFAULTS.max_questions,
    system_prompt: config.system_prompt ?? ASSISTANT_DEFAULTS.system_prompt,
    starter_suggestions:
      Array.isArray(config.starter_suggestions) ? config.starter_suggestions : ASSISTANT_DEFAULTS.starter_suggestions,
  };
}

export async function updateAssistantConfig(config: AssistantConfig) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("feature_settings")
    .update({ config, updated_at: new Date().toISOString() })
    .eq("key", "assistant");
  if (error) throw new Error(error.message);
}

"use server";

import { revalidatePath } from "next/cache";
import { updateAssistantConfig, type AssistantConfig } from "@/lib/data/feature-settings";

export async function saveAssistantConfigAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "ar");

  const config: AssistantConfig = {
    is_enabled: formData.get("is_enabled") === "on",
    daily_limit: Math.max(0, Math.round(Number(formData.get("daily_limit")) || 0)),
    max_questions: Math.max(0, Math.round(Number(formData.get("max_questions")) || 0)),
    system_prompt: String(formData.get("system_prompt") ?? ""),
    starter_suggestions: String(formData.get("starter_suggestions") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  await updateAssistantConfig(config);

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/admin/features/assistant`);
}

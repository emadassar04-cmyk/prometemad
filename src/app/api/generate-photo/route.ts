import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  parsePromptVariables,
  sanitizeVariableValues,
  substituteVariables,
} from "@/lib/prompt-variables";
import { generateImageFromPhoto } from "@/lib/providers/gemini";

const RESULT_BUCKET = "generations";
const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const DAILY_LIMIT = 10;
const MAX_VARIABLE_LENGTH = 200;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const promptId = formData.get("promptId");
  const photo = formData.get("photo");
  const rawVariables = JSON.parse((formData.get("variables") as string) ?? "{}");

  if (typeof promptId !== "string" || !(photo instanceof File)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (!ALLOWED_PHOTO_TYPES.has(photo.type) || photo.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ error: "invalid_photo" }, { status: 400 });
  }

  const { data: prompt, error: promptError } = await supabase
    .from("prompts")
    .select("id, prompt_text_en, variables, status, requires_photo")
    .eq("id", promptId)
    .eq("status", "published")
    .eq("requires_photo", true)
    .single();

  if (promptError || !prompt) {
    return NextResponse.json({ error: "prompt_not_found" }, { status: 404 });
  }

  const allowedKeys = parsePromptVariables(prompt.variables).map((v) => v.key);
  const sanitizedVariables = sanitizeVariableValues(
    rawVariables,
    allowedKeys,
    MAX_VARIABLE_LENGTH,
  );

  const finalPrompt = substituteVariables(
    prompt.prompt_text_en,
    sanitizedVariables,
  );

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_daily_usage",
    { p_user_id: user.id, p_daily_limit: DAILY_LIMIT },
  );

  if (quotaError) {
    return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const { data: generation, error: insertError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      prompt_id: prompt.id,
      final_prompt: finalPrompt,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !generation) {
    return NextResponse.json({ error: "generation_insert_failed" }, { status: 500 });
  }

  try {
    // The uploaded photo is sent straight to Gemini as inline base64 and is
    // never written to our own storage or database — nothing about the
    // user's face persists on our side beyond this request. Only the
    // generated result image is saved, in the user's own storage folder.
    const photoBytes = Buffer.from(await photo.arrayBuffer());
    const photoBase64 = photoBytes.toString("base64");

    const result = await generateImageFromPhoto(photoBase64, photo.type, finalPrompt);

    const ext = MIME_TO_EXT[result.imageMimeType] ?? "png";
    const path = `${user.id}/${generation.id}.${ext}`;
    const resultBytes = Buffer.from(result.imageBase64, "base64");

    const { error: uploadError } = await supabase.storage
      .from(RESULT_BUCKET)
      .upload(path, resultBytes, { contentType: result.imageMimeType });

    if (uploadError) {
      throw new Error(`storage upload failed: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(RESULT_BUCKET).getPublicUrl(path);

    await supabase
      .from("generations")
      .update({
        status: "succeeded",
        image_url: publicUrl,
        provider: "gemini",
      })
      .eq("id", generation.id);

    await supabase.rpc("increment_prompt_generation_count", {
      p_prompt_id: prompt.id,
    });

    return NextResponse.json({
      generationId: generation.id,
      imageUrl: publicUrl,
    });
  } catch (err) {
    console.error("generate-photo failed:", err instanceof Error ? err.message : err);

    await supabase
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generation.id);

    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}

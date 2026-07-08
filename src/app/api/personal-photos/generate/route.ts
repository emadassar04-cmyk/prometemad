import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { editPersonalPhoto } from "@/lib/openai-image-edit";

// gpt-image-1.5 edits took 33-37s in live testing — leave headroom.
export const maxDuration = 90;

const DAILY_LIMIT = 3;
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const BUCKET = "personal-photos";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_banned")
    .eq("id", user.id)
    .single();

  if (profile?.is_banned) {
    return NextResponse.json({ error: "banned" }, { status: 403 });
  }

  // Postgres's p_daily_limit param is `integer` (32-bit) — Number.MAX_SAFE_INTEGER
  // overflows it and makes PostgREST fail to match the RPC signature at all.
  const dailyLimit = profile?.role === "admin" ? 1_000_000 : DAILY_LIMIT;

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_personal_photos_daily_usage",
    { p_user_id: user.id, p_daily_limit: dailyLimit },
  );

  if (quotaError) {
    return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
  }
  if (!allowed) {
    return NextResponse.json({ error: "daily_limit_reached" }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const styleId = formData.get("styleId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (typeof styleId !== "string") {
    return NextResponse.json({ error: "missing_style" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "unsupported_file_type" }, { status: 400 });
  }

  const { data: style, error: styleError } = await supabase
    .from("personal_styles")
    .select("id, prompt_body")
    .eq("id", styleId)
    .eq("is_active", true)
    .single();

  if (styleError || !style) {
    return NextResponse.json({ error: "style_not_found" }, { status: 404 });
  }

  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";

  // Storage uploads go through the service-role client rather than the
  // user's own session — this project's Supabase Storage JWT verification
  // rejects its ES256 session tokens (same workaround as the brand-logo and
  // preview-backfill uploads elsewhere in this codebase).
  const supabaseAdmin = createSupabaseAdminClient();
  const sourcePath = `${user.id}/${crypto.randomUUID()}-source.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(sourcePath, sourceBytes, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }

  const { data: generation, error: insertError } = await supabaseAdmin
    .from("personal_generations")
    .insert({
      user_id: user.id,
      style_id: style.id,
      source_image_path: sourcePath,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !generation) {
    return NextResponse.json({ error: "generation_insert_failed" }, { status: 500 });
  }

  try {
    const resultBytes = await editPersonalPhoto({
      imageBytes: sourceBytes,
      mimeType: file.type,
      promptBody: style.prompt_body,
    });

    const resultPath = `${user.id}/${generation.id}-result.png`;
    const { error: resultUploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(resultPath, resultBytes, { contentType: "image/png" });

    if (resultUploadError) {
      throw new Error("result_upload_failed");
    }

    const { data: signed } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(resultPath, 60 * 60);

    await supabaseAdmin
      .from("personal_generations")
      .update({ status: "done", result_image_path: resultPath })
      .eq("id", generation.id);

    await supabaseAdmin.rpc("increment_personal_style_usage", { p_style_id: style.id });

    return NextResponse.json({
      generationId: generation.id,
      resultUrl: signed?.signedUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await supabaseAdmin
      .from("personal_generations")
      .update({ status: "failed" })
      .eq("id", generation.id);

    if (message === "openai_quota_exhausted") {
      return NextResponse.json({ error: "provider_quota_exhausted" }, { status: 503 });
    }

    console.error("personal-photos generate failed:", message);
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}

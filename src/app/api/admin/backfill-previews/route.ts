import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/data/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

const BUCKET = "prompt-previews";
const MAX_PER_RUN = 15;

// One-off/repeatable maintenance action: fills in preview_image_url for any
// published prompt missing one. Uses the service-role client for the
// storage upload since Supabase Storage's own JWT verification currently
// rejects this project's session tokens (same issue /api/brand-logo works
// around) — irrelevant here anyway since this runs as the admin, not a
// per-user upload.
export async function POST() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: prompts } = await supabaseAdmin
    .from("prompts")
    .select("id, slug, prompt_text_en")
    .eq("status", "published")
    .or("preview_image_url.is.null,preview_image_url.eq.")
    .limit(MAX_PER_RUN);

  let succeeded = 0;
  const failed: string[] = [];

  for (const prompt of prompts ?? []) {
    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt.prompt_text_en,
      )}?width=1024&height=1024&nologo=true`;

      const response = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) {
        failed.push(prompt.slug);
        continue;
      }

      const bytes = new Uint8Array(await response.arrayBuffer());
      const path = `${prompt.slug}.jpg`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType: "image/jpeg", upsert: true });
      if (uploadError) {
        failed.push(prompt.slug);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

      await supabaseAdmin
        .from("prompts")
        .update({ preview_image_url: publicUrl })
        .eq("id", prompt.id);

      succeeded++;
    } catch {
      failed.push(prompt.slug);
    }
  }

  return NextResponse.json({
    processed: prompts?.length ?? 0,
    succeeded,
    failed,
  });
}

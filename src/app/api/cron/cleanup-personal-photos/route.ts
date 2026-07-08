import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

const BUCKET = "personal-photos";
const MAX_ROWS_PER_RUN = 200;
// Sentinel written after a source photo is deleted from storage — keeps the
// column non-null while marking it as already cleaned up, so a re-run
// doesn't try to delete the same (now-gone) storage object again.
const DELETED_SENTINEL = "";

// Vercel Cron automatically sends `Authorization: Bearer ${CRON_SECRET}`
// when that env var is set on the project, so this only needs to check it.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await supabaseAdmin
    .from("personal_generations")
    .select("id, source_image_path")
    .lt("created_at", cutoff)
    .neq("source_image_path", DELETED_SENTINEL)
    .limit(MAX_ROWS_PER_RUN);

  if (error) {
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }
  if (!rows || rows.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  const paths = rows.map((r) => r.source_image_path);
  const { error: removeError } = await supabaseAdmin.storage.from(BUCKET).remove(paths);
  if (removeError) {
    return NextResponse.json({ error: "storage_delete_failed" }, { status: 500 });
  }

  await supabaseAdmin
    .from("personal_generations")
    .update({ source_image_path: DELETED_SENTINEL })
    .in(
      "id",
      rows.map((r) => r.id),
    );

  return NextResponse.json({ deleted: rows.length });
}

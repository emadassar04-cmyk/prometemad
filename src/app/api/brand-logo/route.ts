import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

// Supabase Storage's own JWT verification currently rejects this project's
// ES256-signed session tokens (falls back to anon -> RLS violation), even
// though PostgREST verifies the same tokens correctly. Uploading through this
// server route sidesteps that by authenticating the user via cookies here,
// then writing with the service role key, which bypasses RLS entirely.
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "file too large" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "unsupported file type" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const path = `${user.id}/logo.${ext}`;
  const { error: uploadError } = await admin.storage
    .from("brand-logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("brand-logos").getPublicUrl(path);

  return NextResponse.json({ publicUrl });
}

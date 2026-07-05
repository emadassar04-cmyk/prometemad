import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { describeImageAsPrompt } from "@/lib/gemini-text";

const DAILY_LIMIT = 15;
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

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
    .select("role")
    .eq("id", user.id)
    .single();
  const dailyLimit = profile?.role === "admin" ? Number.MAX_SAFE_INTEGER : DAILY_LIMIT;

  const { data: allowed, error: quotaError } = await supabase.rpc(
    "try_increment_image_to_prompt_usage",
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
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "file too large" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "unsupported file type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  try {
    const result = await describeImageAsPrompt(base64, file.type);
    return NextResponse.json(result);
  } catch (err) {
    console.error("image-to-prompt failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
  }
}

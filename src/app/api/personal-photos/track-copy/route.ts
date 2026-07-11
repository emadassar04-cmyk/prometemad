import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Fire-and-forget usage counter for the self-serve "copy prompt" flow —
// callable signed-out, so increment_personal_style_usage is granted to
// anon (see 20260711010000_personal_styles_selfserve.sql).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const styleId = body?.styleId;

  if (typeof styleId !== "string") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  await supabase.rpc("increment_personal_style_usage", { p_style_id: styleId });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = body?.locale === "en" ? "en" : "ar";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("subscribers").insert({ email, locale });

  // Postgres 23505 = unique_violation. With RLS enabled and no SELECT policy
  // for anon/authenticated, `.upsert(..., { ignoreDuplicates: true })`
  // (which compiles to INSERT ... ON CONFLICT DO NOTHING) fails the RLS
  // check entirely instead of silently skipping — so a plain insert plus
  // catching the duplicate-key error here is what actually makes
  // re-subscribing idempotent.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "subscribe_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

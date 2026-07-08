import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ANON_ID_COOKIE = "showcase_anon_id";
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_SECONDS = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const generationId = body?.generationId;
  if (typeof generationId !== "string" || !generationId) {
    return NextResponse.json({ error: "invalid_generation_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  let anonId = cookieStore.get(ANON_ID_COOKIE)?.value;
  const isNewAnonId = !anonId;
  if (!anonId) {
    anonId = randomUUID();
  }

  // Anonymous, so per-browser dedup (anon_id, below) can be defeated by
  // clearing cookies — this per-IP throttle just stops rapid-fire abuse from
  // a single source, it isn't meant to be airtight.
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const supabase = await createSupabaseServerClient();

  const { data: withinRateLimit, error: rateLimitError } = await supabase.rpc(
    "try_increment_anon_rate_limit",
    {
      p_key: `showcase_like:${ip}`,
      p_max_requests: RATE_LIMIT_MAX_REQUESTS,
      p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
    },
  );

  if (rateLimitError) {
    return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
  }
  if (!withinRateLimit) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { data, error } = await supabase
    .rpc("toggle_generation_like", {
      p_generation_id: generationId,
      p_anon_id: anonId,
    })
    .single();

  if (error) {
    return NextResponse.json({ error: "toggle_failed" }, { status: 500 });
  }

  const response = NextResponse.json(data);
  if (isNewAnonId) {
    response.cookies.set(ANON_ID_COOKIE, anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return response;
}

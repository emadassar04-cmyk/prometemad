import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/data/admin";
import { generateAdminPrompt } from "@/lib/gemini-text";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const idea = body?.idea;
  if (typeof idea !== "string" || !idea.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const generated = await generateAdminPrompt(idea.trim());
    return NextResponse.json(generated);
  } catch {
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/data/admin";
import { parsePromptVariables, substituteVariables } from "@/lib/prompt-variables";
import { callGenerateWebhook } from "@/lib/n8n-generate";

// Lets an admin preview what a prompt-in-progress actually renders before
// publishing it — calls the same image webhook as the public generate flow,
// but with the variables' default values, no quota, and nothing persisted.
export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const promptTextEn = body?.prompt_text_en;
  if (typeof promptTextEn !== "string" || !promptTextEn.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const variables = parsePromptVariables(body?.variables);
  const values = Object.fromEntries(
    variables.map((v) => [v.key, v.default ?? ""]),
  );
  const finalPrompt = substituteVariables(promptTextEn, values);

  const {
    data: { session },
  } = await admin.supabase.auth.getSession();

  try {
    const result = await callGenerateWebhook({
      userId: admin.user.id,
      promptId: typeof body?.prompt_id === "string" ? body.prompt_id : null,
      generationId: crypto.randomUUID(),
      finalPrompt,
      width: 1024,
      height: 1024,
      model: "flux-schnell",
      seed: Math.floor(Math.random() * 1_000_000_000),
      accessToken: session?.access_token,
    });
    return NextResponse.json({ imageUrl: result.image_url, finalPrompt });
  } catch {
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}

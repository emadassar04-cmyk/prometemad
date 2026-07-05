// Shared call to the n8n image-generation webhook, used by both the public
// /api/generate route (which persists a generations row) and the admin
// test-generate route (which doesn't persist anything — just previews).
export async function callGenerateWebhook(params: {
  userId: string;
  promptId: string | null;
  generationId: string;
  finalPrompt: string;
  width: number;
  height: number;
  model: string;
  seed: number;
  accessToken?: string;
}): Promise<{ image_url: string; provider: string }> {
  const webhookUrl = process.env.N8N_GENERATE_IMAGE_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    throw new Error("provider_not_configured");
  }

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": webhookSecret,
      Authorization: `Bearer ${params.accessToken ?? ""}`,
    },
    body: JSON.stringify({
      user_id: params.userId,
      prompt_id: params.promptId,
      generation_id: params.generationId,
      final_prompt: params.finalPrompt,
      width: params.width,
      height: params.height,
      model: params.model,
      seed: params.seed,
    }),
  });

  if (!webhookResponse.ok) {
    throw new Error(`webhook responded ${webhookResponse.status}`);
  }

  const result = (await webhookResponse.json()) as {
    image_url?: string;
    provider?: string;
  };

  if (!result.image_url) {
    throw new Error("webhook response missing image_url");
  }

  return { image_url: result.image_url, provider: result.provider ?? "n8n" };
}

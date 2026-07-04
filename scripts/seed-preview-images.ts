/**
 * Backfills preview_image_url for published prompts that don't have one yet,
 * using the same provider abstraction (lib/providers) the in-app "generate"
 * button uses — default Pollinations.ai (free, no key) for local/dev use.
 *
 * Requires (in .env.local, never commit the service role key):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run with: npm run seed:images
 * Pass --all to regenerate every published prompt's preview, even ones that
 * already have an image (e.g. after editing prompt_text_en): npm run seed:images -- --all
 */
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(new URL("../.env.local", import.meta.url));

const BUCKET = "prompt-previews";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
    process.exit(1);
  }

  console.log(`Using Supabase URL: ${url}`);
  console.log(
    `Service role key loaded: ${serviceRoleKey.length} characters, starts with "${serviceRoleKey.slice(0, 6)}..."`,
  );

  const supabase = createClient(url, serviceRoleKey);
  const regenerateAll = process.argv.includes("--all");

  let query = supabase
    .from("prompts")
    .select("id, slug, prompt_text_en")
    .eq("status", "published");
  if (!regenerateAll) {
    query = query.is("preview_image_url", null);
  }
  const { data: prompts, error } = await query;

  if (error) {
    console.error("Failed to read prompts from Supabase:");
    console.error(JSON.stringify(error, null, 2));
    console.error(
      "\nDouble-check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local " +
        "(the service_role key, not the anon key — copy it fresh from Supabase Settings > API).",
    );
    process.exit(1);
  }
  if (!prompts?.length) {
    console.log("Nothing to backfill — every published prompt already has a preview image.");
    return;
  }

  console.log(
    `${regenerateAll ? "Regenerating" : "Generating"} previews for ${prompts.length} prompt(s)...`,
  );

  let succeeded = 0;
  let failed = 0;

  for (const prompt of prompts) {
    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt.prompt_text_en,
      )}?width=1024&height=1024&nologo=true`;

      const response = await fetchWithRetry(imageUrl);
      if (!response.ok) {
        console.error(`  ✗ ${prompt.slug}: Pollinations returned ${response.status}`);
        failed++;
        continue;
      }

      const bytes = new Uint8Array(await response.arrayBuffer());
      const path = `${prompt.slug}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType: "image/jpeg", upsert: true });

      if (uploadError) {
        console.error(`  ✗ ${prompt.slug}: upload failed — ${uploadError.message}`);
        failed++;
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("prompts")
        .update({ preview_image_url: publicUrl })
        .eq("id", prompt.id);

      if (updateError) {
        console.error(`  ✗ ${prompt.slug}: db update failed — ${updateError.message}`);
        failed++;
        continue;
      }

      console.log(`  ok ${prompt.slug}`);
      succeeded++;
    } catch (err) {
      console.error(
        `  ✗ ${prompt.slug}: ${err instanceof Error ? err.message : String(err)}`,
      );
      failed++;
    }
  }

  console.log(`Done. ${succeeded} succeeded, ${failed} failed.`);
  if (failed > 0) {
    console.log("Re-run the same command to retry the failed ones — completed prompts are skipped unless you pass --all.");
  }
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(30000) });
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

main().catch((err) => {
  console.error("Unexpected error:");
  console.error(err);
  process.exit(1);
});

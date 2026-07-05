import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Every caller across the app invokes this in the component body (not memoized),
// so a module-level singleton is required — otherwise each render/mount spins up
// its own GoTrueClient against the same storage key, and concurrent instances
// race on refresh-token rotation, silently dropping the session (requests then
// fall back to the anon key and RLS writes fail).
let client: SupabaseClient<Database> | undefined;

export function createSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}

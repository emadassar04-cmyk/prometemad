import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Plain, session-less Supabase client for contexts with no incoming request
 * to bind cookies to (sitemap.ts, robots.ts). Only ever used for anonymous,
 * publicly-readable data — RLS still applies.
 */
export function createSupabasePublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

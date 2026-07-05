import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Service-role client: bypasses RLS entirely. Server-only — never import
// from a client component. Callers must verify the user's identity
// themselves (e.g. via createSupabaseServerClient().auth.getUser()) before
// using this to act on their behalf.
export function createSupabaseAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

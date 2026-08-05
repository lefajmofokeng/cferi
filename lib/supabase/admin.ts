import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this into a "use client" component —
// it uses the service role key, which bypasses all RLS policies.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
import { createClient } from "@supabase/supabase-js";

// This client is for server-side use only.
// It uses the SERVICE_ROLE_KEY to bypass Row Level Security.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import { createClient } from "@supabase/supabase-js";


export function createSupabaseServerClient() {
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: true,
      },
    }
  );
}
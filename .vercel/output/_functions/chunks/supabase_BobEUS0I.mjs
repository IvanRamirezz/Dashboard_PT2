import { createClient } from '@supabase/supabase-js';

function createSupabaseServerClient() {
  return createClient(
    "https://rwvybrzprvjmkyutxero.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dnlicnpwcnZqbWt5dXR4ZXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NTA5NjQsImV4cCI6MjA5MzQyNjk2NH0.fWGZ95IR-T3GDvSlVr3U_7p_JuYnsRGMhFYOrnSJ868",
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
}

export { createSupabaseServerClient as c };

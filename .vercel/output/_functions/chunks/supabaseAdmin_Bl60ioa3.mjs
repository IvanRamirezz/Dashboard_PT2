import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  "https://rwvybrzprvjmkyutxero.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dnlicnpwcnZqbWt5dXR4ZXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg1MDk2NCwiZXhwIjoyMDkzNDI2OTY0fQ.tfzKRQhrzh3mtWfq575d5ZN8ZHxxYO5WQbEulL2HtAE",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export { supabaseAdmin as s };

// src/data/client/supabase.ts
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient(
  requestHeaders: Headers,
  responseHeaders: Headers
) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: import.meta.env.PROD,
        path:   "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      },
      cookies: {
        getAll() {
          const cookieHeader = requestHeaders.get("cookie") ?? "";
          if (!cookieHeader) return [];

          return cookieHeader
            .split(";")
            .map((c) => c.trim())
            .filter(Boolean)
            .map((c) => {
              const eqIndex = c.indexOf("=");
              if (eqIndex === -1) return { name: c.trim(), value: "" };
              return {
                name:  c.slice(0, eqIndex).trim(),
                value: c.slice(eqIndex + 1).trim(),
              };
            });
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            const parts = [`${name}=${value}`];

            parts.push(`Path=${options?.path ?? "/"}`);

            if (options?.maxAge)    parts.push(`Max-Age=${options.maxAge}`);
            if (options?.httpOnly)  parts.push("HttpOnly");
            if (options?.secure)    parts.push("Secure");
            if (options?.sameSite)  parts.push(`SameSite=${options.sameSite}`);
            if (options?.expires)   parts.push(`Expires=${options.expires.toUTCString()}`);
            if (options?.domain)    parts.push(`Domain=${options.domain}`);

            responseHeaders.append("set-cookie", parts.join("; "));
          }
        },
      },
    }
  );
}
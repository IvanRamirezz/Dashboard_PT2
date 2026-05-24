// src/business/auth/sessionCookies.ts
import type { AstroCookies } from "astro";

export function getSessionCookieOptions() {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: import.meta.env.PROD,
  };
}

export function clearSessionCookies(cookies: AstroCookies) {
  const options = { path: "/", maxAge: 0 };

  cookies.delete("sb-access-token",  options);
  cookies.delete("sb-refresh-token", options);
  cookies.delete("app-session-id",   options);

  // limpiar cookie de @supabase/ssr — el nombre incluye el project ref
  const projectRef = import.meta.env.PUBLIC_SUPABASE_URL
    ?.split("//")[1]
    ?.split(".")[0];

  if (projectRef) {
    cookies.delete(`sb-${projectRef}-auth-token`, options);
    cookies.delete(`sb-${projectRef}-auth-token-code-verifier`, options);
  }
}
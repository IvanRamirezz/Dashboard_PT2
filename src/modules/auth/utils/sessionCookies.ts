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
  const options = getSessionCookieOptions();

  cookies.delete("sb-access-token", options);
  cookies.delete("sb-refresh-token", options);
  cookies.delete("app-session-id", options);
}

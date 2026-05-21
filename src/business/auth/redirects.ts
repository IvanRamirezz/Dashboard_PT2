// src/business/auth/redirects.ts

export function getSafeRedirectPath(
  redirectTo: string | null | undefined,
  fallback: string
): string {
  if (!redirectTo) return fallback;
  if (!redirectTo.startsWith("/")) return fallback;
  if (redirectTo.startsWith("//")) return fallback;

  return redirectTo;
}
export function getSafeRedirectPath(redirectTo: string | null | undefined, fallback: string) {
  if (!redirectTo) return fallback;

  if (!redirectTo.startsWith("/")) {
    return fallback;
  }

  if (redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}

function getSafeRedirectPath(redirectTo, fallback) {
  if (!redirectTo) return fallback;
  if (!redirectTo.startsWith("/")) {
    return fallback;
  }
  if (redirectTo.startsWith("//")) {
    return fallback;
  }
  return redirectTo;
}

export { getSafeRedirectPath as g };

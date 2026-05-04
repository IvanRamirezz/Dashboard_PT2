function getSessionCookieOptions() {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true
  };
}
function clearSessionCookies(cookies) {
  const options = getSessionCookieOptions();
  cookies.delete("sb-access-token", options);
  cookies.delete("sb-refresh-token", options);
  cookies.delete("app-session-id", options);
}

export { clearSessionCookies as c, getSessionCookieOptions as g };

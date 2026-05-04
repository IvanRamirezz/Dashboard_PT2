import { c as createSupabaseServerClient } from './supabase_BobEUS0I.mjs';
import { g as getSessionCookieOptions } from './sessionCookies_DIQzV6Mc.mjs';

const GET = async ({ url, cookies, redirect }) => {
  const supabase = createSupabaseServerClient();
  const authCode = url.searchParams.get("code");
  if (!authCode) {
    return new Response("No se proporcionó ningún código", { status: 400 });
  }
  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    ...getSessionCookieOptions()
  });
  cookies.set("sb-refresh-token", refresh_token, {
    ...getSessionCookieOptions()
  });
  return redirect("/dashboard");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";
import { getSessionCookieOptions } from "../../../modules/auth/utils/sessionCookies";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
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
    ...getSessionCookieOptions(),
  });
  cookies.set("sb-refresh-token", refresh_token, {
    ...getSessionCookieOptions(),
  });

  return redirect("/dashboard");
};

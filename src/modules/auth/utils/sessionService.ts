import { supabase } from "../../../lib/supabase";
import type { AstroCookies } from "astro";

export async function getValidatedSession(cookies: AstroCookies) {

  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  const sessionIdCookie = cookies.get("app-session-id");

  if (!accessToken || !refreshToken || !sessionIdCookie) {
    return null;
  }

  try {

    const session = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (session.error) {
      return null;
    }

    const user = session.data.session?.user;

    if (!user) {
      return null;
    }

    const { data: usuarioDB } = await supabase
      .from("usuarios")
      .select("active_session_uuid")
      .eq("auth_uid", user.id)
      .single();

    if (
      !usuarioDB ||
      usuarioDB.active_session_uuid !== sessionIdCookie.value
    ) {
      return null;
    }

    return user;

  } catch {

    return null;

  }

}
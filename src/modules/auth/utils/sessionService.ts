import { supabase } from "../../../lib/supabase";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import type { AstroCookies } from "astro";

export async function getValidatedSession(cookies: AstroCookies) {
  const accessToken = cookies.get("sb-access-token");
  const sessionIdCookie = cookies.get("app-session-id");

  if (!accessToken || !sessionIdCookie) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser(accessToken.value);

    if (error || !data.user) {
      return null;
    }

    const user = data.user;

    // 🔥 CAMBIO AQUÍ
    const { data: usuarioDB } = await supabaseAdmin
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
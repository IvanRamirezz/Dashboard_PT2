// src/business/auth/sessionService.ts
import { createSupabaseServerClient } from "../../data/client/supabase";
import { supabaseAdmin } from "../../data/client/supabaseAdmin";
import type { AstroCookies } from "astro";

export async function getValidatedSession(cookies: AstroCookies) {
  const accessToken     = cookies.get("sb-access-token");
  const sessionIdCookie = cookies.get("app-session-id");

  if (!accessToken || !sessionIdCookie) return null;

  try {
    const requestHeaders  = new Headers({ cookie: `sb-access-token=${accessToken.value}` });
    const responseHeaders = new Headers();
    const supabase = createSupabaseServerClient(requestHeaders, responseHeaders);

    const { data, error } = await supabase.auth.getUser(accessToken.value);
    if (error || !data.user) return null;

    const { data: usuarioDB } = await supabaseAdmin
      .from("usuarios")
      .select("active_session_uuid")
      .eq("auth_uid", data.user.id)
      .single();

    if (!usuarioDB || usuarioDB.active_session_uuid !== sessionIdCookie.value) {
      return null;
    }

    return data.user;

  } catch {
    return null;
  }
}
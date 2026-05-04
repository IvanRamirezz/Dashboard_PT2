import { c as createSupabaseServerClient } from './supabase_BobEUS0I.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

async function getValidatedSession(cookies) {
  const accessToken = cookies.get("sb-access-token");
  const sessionIdCookie = cookies.get("app-session-id");
  if (!accessToken || !sessionIdCookie) {
    return null;
  }
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(accessToken.value);
    if (error || !data.user) {
      return null;
    }
    const user = data.user;
    const { data: usuarioDB } = await supabaseAdmin.from("usuarios").select("active_session_uuid").eq("auth_uid", user.id).single();
    if (!usuarioDB || usuarioDB.active_session_uuid !== sessionIdCookie.value) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export { getValidatedSession as g };

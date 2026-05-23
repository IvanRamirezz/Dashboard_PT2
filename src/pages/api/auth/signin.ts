// src/pages/api/auth/signin.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";
import { supabaseAdmin } from "../../../data/client/supabaseAdmin";
import { getUserRole } from "../../../business/auth/userRoleService";
import { getSessionCookieOptions } from "../../../business/auth/sessionCookies";

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email    = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response(null, {
      status: 302,
      headers: { location: "/?error=credenciales" },
    });
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request.headers, responseHeaders);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return new Response(null, {
      status: 302,
      headers: { location: "/?error=credenciales" },
    });
  }

  const { session } = data;
  const authUid     = session.user.id;

  // sesión única por dispositivo
  const sessionId = crypto.randomUUID();
  await supabaseAdmin
    .from("usuarios")
    .update({ active_session_uuid: sessionId })
    .eq("auth_uid", authUid);

  // cookies de sesión propias (además de las de @supabase/ssr)
  const cookieOpts = getSessionCookieOptions();
  cookies.set("sb-access-token",  session.access_token,  cookieOpts);
  cookies.set("sb-refresh-token", session.refresh_token, cookieOpts);
  cookies.set("app-session-id",   sessionId,             cookieOpts);

  const roleData = await getUserRole(authUid);
  if (!roleData) {
    return new Response(null, {
      status: 302,
      headers: { location: "/?error=no_access" },
    });
  }

  let location = "/?error=no_access";

  if (roleData.role === "admin") {
    location = "/dashboard/admin";
  } else if (roleData.role === "profesor") {
    if (roleData.estado === "rechazado") location = "/?error=rechazado";
    else if (roleData.estado === "pendiente") location = "/?error=pendiente";
    else location = "/dashboard/profesor";
  }

  responseHeaders.set("location", location);
  return new Response(null, { status: 302, headers: responseHeaders });
};
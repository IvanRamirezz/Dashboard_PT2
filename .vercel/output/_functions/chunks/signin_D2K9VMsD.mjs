import { c as createSupabaseServerClient } from './supabase_BobEUS0I.mjs';
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';
import { g as getSessionCookieOptions } from './sessionCookies_DIQzV6Mc.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseServerClient();
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    return redirect("/?error=credenciales");
  }
  await supabase.auth.signOut();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    return redirect("/?error=credenciales");
  }
  const session = data.session;
  const authUid = session.user.id;
  const sessionId = crypto.randomUUID();
  await supabaseAdmin.from("usuarios").update({
    active_session_uuid: sessionId
  }).eq("auth_uid", authUid);
  const roleData = await getUserRole(authUid);
  console.log(">>> ROLE DATA:", roleData);
  if (!roleData) {
    return redirect("/?error=no_access");
  }
  if (roleData.role === "admin") {
    setCookies(cookies, session, sessionId);
    return redirect("/dashboard/admin");
  }
  if (roleData.role === "profesor") {
    if (roleData.estado === "rechazado") {
      return redirect("/?error=rechazado");
    }
    if (roleData.estado === "pendiente") {
      return redirect("/?error=pendiente");
    }
    setCookies(cookies, session, sessionId);
    return redirect("/dashboard/profesor");
  }
  return redirect("/?error=no_access");
};
function setCookies(cookies, session, sessionId) {
  cookies.set(
    "sb-access-token",
    session.access_token,
    getSessionCookieOptions()
  );
  cookies.set(
    "sb-refresh-token",
    session.refresh_token,
    getSessionCookieOptions()
  );
  cookies.set(
    "app-session-id",
    sessionId,
    getSessionCookieOptions()
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';
import { g as getSafeRedirectPath } from './redirects_CqUsIr0u.mjs';

async function POST({ request, cookies }) {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });
  const formData = await request.formData();
  const alumno_id = Number(formData.get("alumno_id"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/alumnos"
  );
  try {
    const { data: usuario, error: userError } = await supabaseAdmin.from("usuarios").select("auth_uid").eq("usuario_id", alumno_id).single();
    if (userError || !usuario) {
      console.error(userError);
      return new Response("Usuario no encontrado", { status: 404 });
    }
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      usuario.auth_uid
    );
    if (authError) {
      console.error(authError);
      return new Response("Error eliminando auth user", { status: 500 });
    }
    const { error: dbError } = await supabaseAdmin.from("usuarios").delete().eq("usuario_id", alumno_id);
    if (dbError) {
      console.error(dbError);
      return new Response("Error eliminando usuario", { status: 500 });
    }
  } catch (e) {
    console.error(e);
    return new Response("Error inesperado", { status: 500 });
  }
  return Response.redirect(new URL(redirectPath, request.url), 303);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

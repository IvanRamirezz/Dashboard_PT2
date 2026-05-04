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
  const nombre = String(formData.get("nombre"));
  const apellido_paterno = String(formData.get("apellido_paterno"));
  const apellido_materno = String(formData.get("apellido_materno"));
  const boleta = String(formData.get("boleta"));
  const redirectPath = getSafeRedirectPath(
    formData.get("redirect")?.toString(),
    "/dashboard/admin/alumnos"
  );
  try {
    const [{ error: userError }, { error: studentError }] = await Promise.all([
      supabaseAdmin.from("usuarios").update({ nombre, apellido_paterno, apellido_materno }).eq("usuario_id", alumno_id),
      supabaseAdmin.from("alumnos").update({ boleta }).eq("alumno_id", alumno_id)
    ]);
    if (userError || studentError) {
      console.error(userError ?? studentError);
      return new Response("Error al actualizar", { status: 500 });
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

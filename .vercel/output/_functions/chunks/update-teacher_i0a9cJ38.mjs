import { u as updateTeacherData } from './adminService_DlOO2I4x.mjs';
import { g as getValidatedSession } from './sessionService_EQ2ZgrkK.mjs';
import { g as getUserRole } from './userRoleService_bp0Wj9x4.mjs';
import { g as getSafeRedirectPath } from './redirects_CqUsIr0u.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });
  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });
  const form = await request.formData();
  const profesor_id = Number(form.get("profesor_id"));
  const nombre = String(form.get("nombre"));
  const apellido_paterno = String(form.get("apellido_paterno"));
  const apellido_materno = String(form.get("apellido_materno"));
  const matricula_trabajador = String(form.get("matricula_trabajador"));
  const redirectUrl = getSafeRedirectPath(
    form.get("redirect")?.toString(),
    "/dashboard/admin/profesores"
  );
  try {
    await updateTeacherData(profesor_id, {
      nombre,
      apellido_paterno,
      apellido_materno,
      matricula_trabajador
    });
  } catch (e) {
    console.error(e);
    return new Response("Error al actualizar", { status: 500 });
  }
  return redirect(redirectUrl);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

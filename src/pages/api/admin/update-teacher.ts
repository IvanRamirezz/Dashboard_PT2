import type { APIRoute } from "astro";

import { updateTeacherData } from "../../../modules/admin/services/adminService";
import { getValidatedSession } from "../../../modules/auth/utils/sessionService";
import { getUserRole } from "../../../modules/auth/services/userRoleService";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {

  /*
  validar sesión y rol
  */
  const user = await getValidatedSession(cookies);
  if (!user) return new Response("No autorizado", { status: 401 });

  const roleData = await getUserRole(user.id);
  if (roleData?.role !== "admin") return new Response("Sin permisos", { status: 403 });

  /*
  obtener datos del form
  */
  const form = await request.formData();

  const profesor_id        = Number(form.get("profesor_id"));
  const nombre             = String(form.get("nombre"));
  const apellido_paterno   = String(form.get("apellido_paterno"));
  const apellido_materno   = String(form.get("apellido_materno"));
  const matricula_trabajador = String(form.get("matricula_trabajador"));
  const redirectUrl        = String(form.get("redirect")) || "/dashboard/admin/profesores";

  /*
  actualizar datos del profesor
  */
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
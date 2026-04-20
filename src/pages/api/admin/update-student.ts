import type { APIContext } from "astro";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getValidatedSession } from "../../../modules/auth/utils/sessionService";
import { getUserRole } from "../../../modules/auth/services/userRoleService";

export async function POST({ request, cookies }: APIContext) {

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
  const formData = await request.formData();

  const alumno_id      = Number(formData.get("alumno_id"));
  const nombre         = String(formData.get("nombre"));
  const apellido_paterno = String(formData.get("apellido_paterno"));
  const apellido_materno = String(formData.get("apellido_materno"));
  const boleta         = String(formData.get("boleta"));
  const redirect       = String(formData.get("redirect"));

  /*
  validar redirect antes de operar
  */
  if (!redirect) {
    return new Response("Redirect no definido", { status: 400 });
  }

  /*
  actualizar usuarios y alumnos en paralelo
  */
  try {

    const [{ error: userError }, { error: studentError }] = await Promise.all([
      supabaseAdmin
        .from("usuarios")
        .update({ nombre, apellido_paterno, apellido_materno })
        .eq("usuario_id", alumno_id),
      supabaseAdmin
        .from("alumnos")
        .update({ boleta })
        .eq("alumno_id", alumno_id)
    ]);

    if (userError || studentError) {
      console.error(userError ?? studentError);
      return new Response("Error al actualizar", { status: 500 });
    }

  } catch (e) {
    console.error(e);
    return new Response("Error inesperado", { status: 500 });
  }

  return Response.redirect(new URL(redirect, request.url), 303);

}
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

  const alumno_id = Number(formData.get("alumno_id"));
  const redirect  = String(formData.get("redirect"));

  if (!redirect) {
    return new Response("Redirect no definido", { status: 400 });
  }

  try {

    /*
    obtener auth_uid
    */
    const { data: usuario, error: userError } = await supabaseAdmin
      .from("usuarios")
      .select("auth_uid")
      .eq("usuario_id", alumno_id)
      .single();

    if (userError || !usuario) {
      console.error(userError);
      return new Response("Usuario no encontrado", { status: 404 });
    }

    /*
    eliminar usuario de auth
    */
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      usuario.auth_uid
    );

    if (authError) {
      console.error(authError);
      return new Response("Error eliminando auth user", { status: 500 });
    }

    /*
    eliminar registro en usuarios
    cascade eliminará alumno y resultados
    */
    const { error: dbError } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("usuario_id", alumno_id);

    if (dbError) {
      console.error(dbError);
      return new Response("Error eliminando usuario", { status: 500 });
    }

  } catch (e) {
    console.error(e);
    return new Response("Error inesperado", { status: 500 });
  }

  return Response.redirect(new URL(redirect, request.url), 303);

}
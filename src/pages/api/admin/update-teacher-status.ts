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

  const profesor_id = formData.get("profesor_id");
  const estado      = formData.get("estado");

  if (!profesor_id || !estado) {
    return new Response("Datos incompletos", { status: 400 });
  }

  /*
  actualizar estado del profesor
  */
  try {

    const { error } = await supabaseAdmin
      .from("profesores")
      .update({ estado })
      .eq("profesor_id", profesor_id);

    if (error) {
      console.error(error);
      return new Response("Error al actualizar", { status: 500 });
    }

  } catch (e) {
    console.error(e);
    return new Response("Error inesperado", { status: 500 });
  }

  /*
  redirigir al panel
  */
  return new Response(null, {
    status: 302,
    headers: { Location: "/dashboard/admin" }
  });

}
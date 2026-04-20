import type { APIRoute } from "astro";

import { supabase } from "../../../lib/supabase";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

import { getUserRole } from "../../../modules/auth/services/userRoleService";


export const POST: APIRoute = async ({ request, cookies, redirect }) => {

  const formData = await request.formData();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();


  if (!email || !password) {

    return redirect("/?error=credenciales");

  }

/*
login supabase
*/

// limpiar cualquier sesión anterior
    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithPassword({

      email,
      password,

    });


  if (error) {

    return redirect("/?error=credenciales");

  }



  const session = data.session;

  const authUid = session.user.id;



  /*
  generar id de sesión única
  */

  const sessionId = crypto.randomUUID();



  /*
  guardar sesión activa en BD
  */

  await supabaseAdmin

    .from("usuarios")

    .update({

      active_session_uuid: sessionId

    })

    .eq("auth_uid", authUid);



  /*
  obtener rol
  */

  const roleData = await getUserRole(authUid);


  if (!roleData) {

    return redirect("/?error=no_access");

  }



  /*
  ADMIN
  */

  if (roleData.role === "admin") {

    setCookies(cookies, session, sessionId);

    return redirect("/dashboard/admin");

  }



  /*
  PROFESOR
  */

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



  /*
  alumno no entra al dashboard web
  */

  return redirect("/?error=no_access");

};




function setCookies(

  cookies:any,
  session:any,
  sessionId:string

) {

  cookies.set(

    "sb-access-token",

    session.access_token,

    { path: "/" }

  );



  cookies.set(

    "sb-refresh-token",

    session.refresh_token,

    { path: "/" }

  );



  cookies.set(

    "app-session-id",

    sessionId,

    { path: "/" }

  );

}
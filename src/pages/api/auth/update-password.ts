import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";


export const POST: APIRoute = async ({

  request,
  redirect,
  cookies

}) => {

  const formData = await request.formData();

  const password = formData.get("password")?.toString();


  if (!password) {

    return redirect("/auth/update-password?error=1");

  }


  /*
  Supabase detecta automáticamente
  el usuario desde el link seguro
  */

  const { error } = await supabase.auth.updateUser({

    password

  });


  if (error) {

    return redirect("/auth/update-password?error=1");

  }


  /*
  cerrar sesión del recovery token
  para que el link no pueda reutilizarse
  */

  await supabase.auth.signOut();


  /*
  limpiar cookies viejas
  */

  cookies.delete("sb-access-token",{ path:"/" });
  cookies.delete("sb-refresh-token",{ path:"/" });
  cookies.delete("app-session-id",{ path:"/" });


  /*
  quedarse en la misma página
  mostrando mensaje de éxito
  */

  return redirect("/auth/update-password?success=1");

};
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";
import { clearSessionCookies } from "../../../modules/auth/utils/sessionCookies";


export const POST: APIRoute = async ({

  request,
  redirect,
  cookies,

}) => {
  const supabase = createSupabaseServerClient();

  const formData = await request.formData();

  const password = formData.get("password")?.toString();
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;


  if (!password) {

    return redirect("/auth/update-password?error=1");

  }

  if (!accessToken || !refreshToken) {

    return redirect("/auth/update-password?error=1");

  }


  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {

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

  clearSessionCookies(cookies);


  /*
  quedarse en la misma página
  mostrando mensaje de éxito
  */

  return redirect("/auth/update-password?success=1");

};

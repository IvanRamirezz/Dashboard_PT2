import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../data/client/supabaseAdmin";
import { clearSessionCookies } from "../../../business/auth/sessionCookies";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const accessToken = cookies.get("sb-access-token")?.value;
  console.log("access_token:", cookies.get("sb-access-token")?.value ? "OK" : "MISSING");

  if (!password || !accessToken) {
    return redirect("/auth/update-password?error=1");
  }

  // Extraer el user id del JWT
  const payload = JSON.parse(atob(accessToken.split(".")[1]));
  const userId = payload.sub;

  if (!userId) {
    return redirect("/auth/update-password?error=1");
  }

  // Actualizar contraseña directo con admin, sin necesitar el refresh token
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    return redirect("/auth/update-password?error=1");
  }

  clearSessionCookies(cookies);

  return redirect("/auth/update-password?success=1");
};
// src/pages/api/auth/update-password.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";
import { clearSessionCookies } from "../../../business/auth/sessionCookies";

const MIN_PASSWORD_LENGTH = 8;

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData        = await request.formData();
  const password        = formData.get("password")?.toString();
  const passwordConfirm = formData.get("passwordConfirm")?.toString();

  const responseHeaders = new Headers();

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    responseHeaders.set("location", "/auth/update-password?error=password_corto");
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  if (password !== passwordConfirm) {
    responseHeaders.set("location", "/auth/update-password?error=no_coinciden");
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  const supabase = createSupabaseServerClient(request.headers, responseHeaders);
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    // Supabase devuelve code "same_password" cuando es igual a la actual
    const location = error.code === "same_password"
      ? "/auth/update-password?error=misma_contrasena"
      : "/auth/update-password?error=error_actualizacion";

    responseHeaders.set("location", location);
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  clearSessionCookies(cookies);
  responseHeaders.set("location", "/auth/update-password?success=1");
  return new Response(null, { status: 302, headers: responseHeaders });
};
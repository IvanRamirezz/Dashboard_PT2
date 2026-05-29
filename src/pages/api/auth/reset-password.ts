// src/pages/api/auth/reset-password.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email    = formData.get("email")?.toString().trim();

  if (!email) {
    return new Response(null, {
      status: 302,
      headers: { location: "/auth/forgot-password" },
    });
  }

  // leer cookies directamente del request — no necesitamos el objeto cookies de Astro
  const requestHeaders  = new Headers({ cookie: request.headers.get("cookie") ?? "" });
  const responseHeaders = new Headers();

  const supabase = createSupabaseServerClient(requestHeaders, responseHeaders);

  const redirectTo = new URL(
    "/api/auth/callback?next=/auth/update-password",
    request.url
  ).toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  // copiar las cookies que Supabase escribió (incluye code_verifier) antes del redirect
  const finalHeaders = new Headers(responseHeaders);
  finalHeaders.set(
    "location",
    error
      ? "/auth/forgot-password?error=1"
      : "/auth/forgot-password?message=sent"
  );

  return new Response(null, { status: 302, headers: finalHeaders });
};
// src/pages/api/auth/reset-password.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../data/client/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email    = formData.get("email")?.toString();

  if (!email) {
    return new Response(null, {
      status: 302,
      headers: { location: "/auth/forgot-password" },
    });
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(request.headers, responseHeaders);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: new URL("/api/auth/callback?next=/auth/update-password", request.url).toString(),
  });

  // ✓ redirect manual — responseHeaders incluye la cookie del code_verifier
  responseHeaders.set(
    "location",
    error ? "/auth/forgot-password?error=1" : "/auth/forgot-password?message=sent"
  );

  return new Response(null, { status: 302, headers: responseHeaders });
};
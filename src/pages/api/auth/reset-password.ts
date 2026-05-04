import type { APIRoute } from "astro";

import { createSupabaseServerClient } from "../../../lib/supabase";


export const POST: APIRoute = async ({

  request,
  redirect

}) => {
  const supabase = createSupabaseServerClient();

  const formData = await request.formData();

  const email = formData.get("email")?.toString();


  if (!email) {

    return redirect("/auth/forgot-password");

  }


  const { error } = await supabase.auth.resetPasswordForEmail(

    email,

    {

      redirectTo:
      new URL("/auth/update-password", request.url).toString()

    }

  );


  if (error) {

    return redirect("/auth/forgot-password");

  }


  return redirect("/auth/forgot-password?message=sent");

};

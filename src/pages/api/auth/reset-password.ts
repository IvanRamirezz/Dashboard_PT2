import type { APIRoute } from "astro";

import { supabase } from "../../../lib/supabase";


export const POST: APIRoute = async ({

  request,
  redirect

}) => {

  const formData = await request.formData();

  const email = formData.get("email")?.toString();


  if (!email) {

    return redirect("/auth/forgot-password");

  }


  const { error } = await supabase.auth.resetPasswordForEmail(

    email,

    {

      redirectTo:

      "http://localhost:4321/auth/update-password"

    }

  );


  if (error) {

    return redirect("/auth/forgot-password");

  }


  return redirect("/auth/forgot-password?message=sent");

};
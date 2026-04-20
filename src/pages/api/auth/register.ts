import type { APIContext } from "astro";
import { validateRegister } from "../../../modules/auth/validators/authValidator";
import { registerUser } from "../../../modules/auth/services/authService";

export async function POST({ request, redirect }: APIContext) {

  let data: any;

  try {

    const formData = await request.formData();

    data = {

      nombre: formData.get("nombre"),
      apellidoPaterno: formData.get("apellidoPaterno"),
      apellidoMaterno: formData.get("apellidoMaterno"),

      email: formData.get("email"),
      password: formData.get("password"),
      passwordConfirm: formData.get("passwordConfirm"),

      role: formData.get("role"),

      boleta: formData.get("boleta"),
      matricula: formData.get("matricula"),

    };


    validateRegister(data);

    await registerUser(data);


    return redirect(

      `/register/success?type=${data.role}`

    );

  }


  catch (err:any) {


    /*
    email duplicado
    */
    if (err.message === "EMAIL_EXISTS") {

      return redirect(

        `/register/error?reason=email&type=${data?.role}`

      );

    }


    /*
    boleta o matricula duplicada
    */
    if (err.message === "DATA_EXISTS") {

      return redirect(

        `/register/error?reason=duplicate&type=${data?.role}`

      );

    }


    console.error(err);


    return redirect(

      `/register/error?reason=unknown&type=${data?.role}`

    );

  }

}
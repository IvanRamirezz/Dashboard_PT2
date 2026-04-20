import { supabaseAdmin } from "../../../lib/supabaseAdmin";

import {
  createUsuario,
  createAlumno,
  createProfesor
} from "../../users/repositories/userRepository";

export async function registerUser(data: any) {

  const {
    email,
    password,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    role,
    boleta,
    matricula,
  } = data;


  /*
  1 crear usuario en auth
  */
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({

      email,
      password,

      email_confirm: false

    });


  if (authError) {

    const message = authError.message.toLowerCase();

    if (
      message.includes("already") ||
      message.includes("exists") ||
      message.includes("registered") ||
      message.includes("duplicate")
    ) {

      throw new Error("EMAIL_EXISTS");

    }

    throw new Error(authError.message);

  }


  const authUid = authData.user.id;


  /*
  2 crear usuario en tabla usuarios
  */
  const usuario = await createUsuario(

    authUid,
    nombre,
    apellidoPaterno,
    apellidoMaterno

  );


  /*
  3 crear subtipo
  */

  try {

    if (role === "student") {

      await createAlumno(
        usuario.usuario_id,
        boleta
      );

    }


    if (role === "teacher") {

      await createProfesor(
        usuario.usuario_id,
        matricula
      );

    }

  }
  catch (error:any) {

    const message = error.message.toLowerCase();

    if (
      message.includes("duplicate") ||
      message.includes("unique")
    ) {

      throw new Error("DATA_EXISTS");

    }

    throw error;

  }


  return authData.user;

}
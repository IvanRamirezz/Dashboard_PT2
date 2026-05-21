import { supabaseAdmin } from "../../data/client/supabaseAdmin";
import { createSupabaseServerClient } from "../../data/client/supabase";

const supabase = createSupabaseServerClient();

import {
  createUsuario,
  createAlumno,
  createProfesor
} from "../../data/repositories/userRepository";

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

  await ensureUniqueSubtypeData(role, boleta, matricula);

  let authUid: string | null = null;
  let usuarioId: number | null = null;

  try {

    /*
    1 crear usuario en auth (ENVÍA CORREO AUTOMÁTICO)
    */
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:4321/auth/callback"
        }
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

    // ⚠️ Validación importante
    if (!authData.user) {
      throw new Error("AUTH_UID_MISSING");
    }

    authUid = authData.user.id;

    /*
    2 crear usuario en tabla usuarios
    */
    const usuario = await createUsuario(
      authUid,
      nombre,
      apellidoPaterno,
      apellidoMaterno
    );

    usuarioId = usuario.usuario_id;

    /*
    3 crear subtipo
    */
    if (role === "student") {
      await createAlumno(usuario.usuario_id, boleta);
    }

    if (role === "teacher") {
      await createProfesor(usuario.usuario_id, matricula);
    }

    return authData.user;

  } catch (error: any) {

    await rollbackFailedRegistration(authUid, usuarioId);

    const message = error.message?.toLowerCase?.() || "";

    if (
      message.includes("duplicate") ||
      message.includes("unique") ||
      error.message === "DATA_EXISTS"
    ) {
      throw new Error("DATA_EXISTS");
    }

    if (error.message === "AUTH_UID_MISSING") {
      throw new Error("UNKNOWN_ERROR");
    }

    throw error;
  }
}

/*
VALIDACIONES DE DUPLICADOS
*/
async function ensureUniqueSubtypeData(
  role: string,
  boleta?: string,
  matricula?: string,
) {
  if (role === "student" && boleta) {
    const { data } = await supabaseAdmin
      .from("alumnos")
      .select("alumno_id")
      .eq("boleta", boleta)
      .maybeSingle();

    if (data) {
      throw new Error("DATA_EXISTS");
    }
  }

  if (role === "teacher" && matricula) {
    const { data } = await supabaseAdmin
      .from("profesores")
      .select("profesor_id")
      .eq("matricula_trabajador", matricula)
      .maybeSingle();

    if (data) {
      throw new Error("DATA_EXISTS");
    }
  }
}

/*
ROLLBACK SI FALLA TODO
*/
async function rollbackFailedRegistration(
  authUid: string | null,
  usuarioId: number | null,
) {
  if (usuarioId) {
    await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("usuario_id", usuarioId);
  }

  if (authUid) {
    await supabaseAdmin.auth.admin.deleteUser(authUid);
  }
}
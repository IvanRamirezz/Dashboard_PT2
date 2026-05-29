// src/business/auth/authService.ts
import { supabaseAdmin } from "../../data/client/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";
import {
  createUsuario,
  createAlumno,
  createProfesor,
} from "../../data/repositories/userRepository";

export interface RegisterPayload {
  email:           string;
  password:        string;
  passwordConfirm: string;
  nombre:          string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  role:            "student" | "teacher";
  boleta?:         string;
  matricula?:      string;
  baseUrl:         string;
}

const supabasePublic = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function registerUser(data: RegisterPayload) {
  const { email, password, nombre, apellidoPaterno, apellidoMaterno, role, boleta, matricula, baseUrl } = data;

  await ensureUniqueSubtypeData(role, boleta, matricula, email);

  let authUid:   string | null = null;
  let usuarioId: number | null = null;

  try {
    // 1 — signUp con confirmación por email
    const { data: signUpData, error: signUpError } = await supabasePublic.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${baseUrl}/auth/confirm` },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already") || msg.includes("exists") || msg.includes("registered") || msg.includes("duplicate")) {
        throw new Error("EMAIL_EXISTS");
      }
      throw new Error(signUpError.message);
    }

    // 2 — obtener uid
    // con SMTP+confirmación Supabase devuelve user: null — recuperar con getUserById no es posible sin uid
    // alternativa: el error de signUp ya captura duplicados, aquí solo falta obtener el uid del usuario recién creado
    authUid = signUpData?.user?.id ?? signUpData?.session?.user?.id ?? null;

    if (!authUid) {
      // buscar en auth.users via RPC — evita listUsers paginado
      const { data: found } = await supabaseAdmin
        .rpc("get_auth_uid_by_email", { p_email: email });

      if (!found) throw new Error("AUTH_UID_MISSING");
      authUid = found as string;
    }

    if (!authUid) throw new Error("AUTH_UID_MISSING");

    // 3 — tabla usuarios
    const usuario = await createUsuario(authUid, nombre, apellidoPaterno, apellidoMaterno);
    usuarioId = usuario.usuario_id;

    // 4 — subtipo
    if (role === "student" && boleta)   await createAlumno(usuario.usuario_id, boleta);
    if (role === "teacher" && matricula) await createProfesor(usuario.usuario_id, matricula);

    return signUpData?.user ?? { id: authUid, email };

  } catch (error: unknown) {
    await rollbackFailedRegistration(authUid, usuarioId);

    const msg = error instanceof Error ? error.message.toLowerCase() : "";

    if (msg.includes("duplicate") || msg.includes("unique") || msg === "data_exists") {
      throw new Error("DATA_EXISTS");
    }
    if (msg === "auth_uid_missing") throw new Error("UNKNOWN_ERROR");

    throw error;
  }
}

async function ensureUniqueSubtypeData(
  role:      string,
  boleta?:   string,
  matricula?: string,
  email?:    string,
) {
  // verificar email directamente en auth.users sin paginación
  if (email) {
    const { data: existing } = await supabaseAdmin
      .rpc("get_auth_uid_by_email", { p_email: email });

    if (existing) throw new Error("EMAIL_EXISTS");
  }

  if (role === "student" && boleta) {
    const { data } = await supabaseAdmin
      .from("alumnos").select("alumno_id").eq("boleta", boleta).maybeSingle();
    if (data) throw new Error("DATA_EXISTS");
  }

  if (role === "teacher" && matricula) {
    const { data } = await supabaseAdmin
      .from("profesores").select("profesor_id").eq("matricula_trabajador", matricula).maybeSingle();
    if (data) throw new Error("DATA_EXISTS");
  }
}

async function rollbackFailedRegistration(authUid: string | null, usuarioId: number | null) {
  if (usuarioId) {
    await supabaseAdmin.from("usuarios").delete().eq("usuario_id", usuarioId);
  }
  if (authUid) {
    await supabaseAdmin.auth.admin.deleteUser(authUid);
  }
}
import { s as supabaseAdmin } from './supabaseAdmin_Bl60ioa3.mjs';

function validateRegister(data) {
  const {
    email,
    password,
    passwordConfirm,
    role,
    boleta,
    matricula
  } = data;
  if (!email || !password) {
    throw new Error("Email y contraseña requeridos");
  }
  if (password !== passwordConfirm) {
    throw new Error("Las contraseñas no coinciden");
  }
  if (!["student", "teacher"].includes(role)) {
    throw new Error("Rol inválido");
  }
  if (role === "student" && !boleta) {
    throw new Error("Boleta requerida");
  }
  if (role === "teacher" && !matricula) {
    throw new Error("Matrícula requerida");
  }
}

async function createUsuario(authUid, nombre, apellidoPaterno, apellidoMaterno) {
  const { data, error } = await supabaseAdmin.from("usuarios").insert({
    auth_uid: authUid,
    nombre,
    apellido_paterno: apellidoPaterno,
    apellido_materno: apellidoMaterno
  }).select().single();
  if (error || !data) {
    throw new Error("Error creando usuario");
  }
  return data;
}
async function createAlumno(usuarioId, boleta) {
  const { error } = await supabaseAdmin.from("alumnos").insert({
    alumno_id: usuarioId,
    boleta
  });
  if (error) {
    throw new Error(error.message);
  }
}
async function createProfesor(usuarioId, matricula) {
  const { error } = await supabaseAdmin.from("profesores").insert({
    profesor_id: usuarioId,
    matricula_trabajador: matricula,
    estado: "pendiente"
  });
  if (error) {
    throw new Error(error.message);
  }
}

async function registerUser(data) {
  const {
    email,
    password,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    role,
    boleta,
    matricula
  } = data;
  await ensureUniqueSubtypeData(role, boleta, matricula);
  let authUid = null;
  let usuarioId = null;
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });
    if (authError) {
      const message = authError.message.toLowerCase();
      if (message.includes("already") || message.includes("exists") || message.includes("registered") || message.includes("duplicate")) {
        throw new Error("EMAIL_EXISTS");
      }
      throw new Error(authError.message);
    }
    authUid = authData.user.id;
    const usuario = await createUsuario(
      authUid,
      nombre,
      apellidoPaterno,
      apellidoMaterno
    );
    usuarioId = usuario.usuario_id;
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
    return authData.user;
  } catch (error) {
    await rollbackFailedRegistration(authUid, usuarioId);
    const message = error.message.toLowerCase();
    if (message.includes("duplicate") || message.includes("unique") || error.message === "DATA_EXISTS") {
      throw new Error("DATA_EXISTS");
    }
    throw error;
  }
}
async function ensureUniqueSubtypeData(role, boleta, matricula) {
  if (role === "student" && boleta) {
    const { data } = await supabaseAdmin.from("alumnos").select("alumno_id").eq("boleta", boleta).maybeSingle();
    if (data) {
      throw new Error("DATA_EXISTS");
    }
  }
  if (role === "teacher" && matricula) {
    const { data } = await supabaseAdmin.from("profesores").select("profesor_id").eq("matricula_trabajador", matricula).maybeSingle();
    if (data) {
      throw new Error("DATA_EXISTS");
    }
  }
}
async function rollbackFailedRegistration(authUid, usuarioId) {
  if (usuarioId) {
    await supabaseAdmin.from("usuarios").delete().eq("usuario_id", usuarioId);
  }
  if (authUid) {
    await supabaseAdmin.auth.admin.deleteUser(authUid);
  }
}

async function POST({ request, redirect }) {
  let data;
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
      matricula: formData.get("matricula")
    };
    validateRegister(data);
    await registerUser(data);
    return redirect(
      `/register/success?type=${data.role}`
    );
  } catch (err) {
    if (err.message === "EMAIL_EXISTS") {
      return redirect(
        `/register/error?reason=email&type=${data?.role}`
      );
    }
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

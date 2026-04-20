export function validateRegister(data: any) {
  const {
    email,
    password,
    passwordConfirm,
    role,
    boleta,
    matricula,
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
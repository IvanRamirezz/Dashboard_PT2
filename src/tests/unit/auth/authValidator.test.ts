// src/tests/unit/auth/authValidator.test.ts
import { describe, it, expect } from "vitest";
import { validateRegister } from "../../../business/auth/authValidator";

const baseProfesor = {
  email:           "profesor@example.com",
  password:        "Secret123!",
  passwordConfirm: "Secret123!",
  role:            "teacher",
  matricula:       "T12345",
  boleta:          undefined,
};

const baseAlumno = {
  email:           "alumno@example.com",
  password:        "Secret123!",
  passwordConfirm: "Secret123!",
  role:            "student",
  boleta:          "2021600123",
  matricula:       undefined,
};

describe("validateRegister — casos válidos", () => {
  it("acepta profesor con todos los campos correctos", () => {
    expect(() => validateRegister(baseProfesor)).not.toThrow();
  });

  it("acepta alumno con todos los campos correctos", () => {
    expect(() => validateRegister(baseAlumno)).not.toThrow();
  });
});

describe("validateRegister — email y contraseña", () => {
  it("lanza error si falta el email", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, email: "" })
    ).toThrow("Email y contraseña requeridos");
  });

  it("lanza error si falta la contraseña", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, password: "" })
    ).toThrow("Email y contraseña requeridos");
  });

  it("lanza error si contraseña menor a 8 caracteres", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, password: "abc", passwordConfirm: "abc" })
    ).toThrow("La contraseña debe tener al menos 8 caracteres");
  });

  it("lanza error si las contraseñas no coinciden", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, passwordConfirm: "Diferente99!" })
    ).toThrow("Las contraseñas no coinciden");
  });
});

describe("validateRegister — validación de rol", () => {
  it("lanza error si el rol es admin — no registrable públicamente", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, role: "admin" })
    ).toThrow("Rol inválido");
  });

  it("lanza error si el rol está vacío", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, role: "" })
    ).toThrow("Rol inválido");
  });

  it("lanza error si el rol es un valor arbitrario", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, role: "superuser" })
    ).toThrow("Rol inválido");
  });

  it("acepta teacher y student como roles válidos", () => {
    expect(() => validateRegister(baseProfesor)).not.toThrow();
    expect(() => validateRegister(baseAlumno)).not.toThrow();
  });
});

describe("validateRegister — campos por rol", () => {
  it("lanza error si profesor no tiene matrícula", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, matricula: "" })
    ).toThrow("Matrícula requerida");
  });

  it("lanza error si alumno no tiene boleta", () => {
    expect(() =>
      validateRegister({ ...baseAlumno, boleta: "" })
    ).toThrow("Boleta requerida");
  });

  it("no exige matrícula si el rol es alumno", () => {
    expect(() =>
      validateRegister({ ...baseAlumno, matricula: undefined })
    ).not.toThrow();
  });

  it("no exige boleta si el rol es profesor", () => {
    expect(() =>
      validateRegister({ ...baseProfesor, boleta: undefined })
    ).not.toThrow();
  });
});
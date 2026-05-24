// src/tests/unit/auth/redirects.test.ts
import { describe, it, expect } from "vitest";
import { getSafeRedirectPath } from "../../../business/auth/redirects";

const FALLBACK = "/dashboard";

describe("getSafeRedirectPath — valores vacíos", () => {
  it("retorna fallback si redirectTo es undefined", () => {
    expect(getSafeRedirectPath(undefined, FALLBACK)).toBe(FALLBACK);
  });

  it("retorna fallback si redirectTo es null", () => {
    expect(getSafeRedirectPath(null, FALLBACK)).toBe(FALLBACK);
  });

  it("retorna fallback si redirectTo es string vacío", () => {
    expect(getSafeRedirectPath("", FALLBACK)).toBe(FALLBACK);
  });
});

describe("getSafeRedirectPath — rutas internas válidas", () => {
  it("acepta ruta interna simple", () => {
    expect(getSafeRedirectPath("/dashboard/profesor", FALLBACK))
      .toBe("/dashboard/profesor");
  });

  it("acepta ruta con query params", () => {
    expect(getSafeRedirectPath("/dashboard/admin?success=alta", FALLBACK))
      .toBe("/dashboard/admin?success=alta");
  });

  it("acepta la ruta raíz /", () => {
    expect(getSafeRedirectPath("/", FALLBACK)).toBe("/");
  });
});

describe("getSafeRedirectPath — bloqueo de open redirect", () => {
  it("bloquea URL con http://", () => {
    expect(getSafeRedirectPath("http://evil.com", FALLBACK)).toBe(FALLBACK);
  });

  it("bloquea URL con https://", () => {
    expect(getSafeRedirectPath("https://phishing.com", FALLBACK)).toBe(FALLBACK);
  });

  it("bloquea protocolo relativo //evil.com", () => {
    expect(getSafeRedirectPath("//evil.com", FALLBACK)).toBe(FALLBACK);
  });

  it("bloquea URL sin esquema pero con dominio externo", () => {
    expect(getSafeRedirectPath("evil.com/steal", FALLBACK)).toBe(FALLBACK);
  });

  it("bloquea backslash \\evil.com", () => {
    expect(getSafeRedirectPath("\\evil.com", FALLBACK)).toBe(FALLBACK);
  });
});
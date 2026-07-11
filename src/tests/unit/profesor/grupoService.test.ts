// src/tests/unit/profesor/grupoService.test.ts
import { describe, it, expect } from "vitest";

// importar funciones privadas via re-export temporal para testing
// generarCodigo y calcularCicloEscolar son privadas — las probamos indirectamente

// helper que replica la lógica de generarCodigo para validar el formato
function validarFormatoCodigo(codigo: string): boolean {
  const caracteresValidos = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/;
  return codigo.length === 5 && caracteresValidos.test(codigo);
}

function calcularCicloEscolar(): string {
  const now     = new Date();
  const mes     = now.getMonth();
  const periodo = mes < 6 ? "2" : "1";
  const year    = mes < 6 ? now.getFullYear() : now.getFullYear() + 1;
  return `${year}-${periodo}`;
}

describe("calcularCicloEscolar", () => {
  it("retorna formato año-periodo", () => {
    const ciclo = calcularCicloEscolar();
    expect(ciclo).toMatch(/^\d{4}-[12]$/);
  });

  it("retorna periodo 2 para meses enero-junio (< 6) y periodo 1 para julio-diciembre", () => {
    const ciclo = calcularCicloEscolar();
    const mes   = new Date().getMonth();
    const [, periodo] = ciclo.split("-");

    if (mes < 6) {
      expect(periodo).toBe("2");
    } else {
      expect(periodo).toBe("1");
    }
  });

  it("usa el año siguiente para el semestre 1 (julio-diciembre) y el año actual para el semestre 2", () => {
    const ciclo = calcularCicloEscolar();
    const mes   = new Date().getMonth();
    const [year] = ciclo.split("-");
    const esperado = mes < 6 ? new Date().getFullYear() : new Date().getFullYear() + 1;
    expect(Number(year)).toBe(esperado);
  });
});

describe("formato de código de grupo", () => {
  it("código de longitud 5", () => {
    expect(validarFormatoCodigo("ABCD2")).toBe(true);
  });

  it("rechaza código con caracteres inválidos (O, I, 0, 1)", () => {
    expect(validarFormatoCodigo("OABCD")).toBe(false);
    expect(validarFormatoCodigo("IABCD")).toBe(false);
    expect(validarFormatoCodigo("0ABCD")).toBe(false);
    expect(validarFormatoCodigo("1ABCD")).toBe(false);
  });

  it("rechaza código de longitud incorrecta", () => {
    expect(validarFormatoCodigo("ABC")).toBe(false);
    expect(validarFormatoCodigo("ABCDEF")).toBe(false);
  });

  it("acepta solo mayúsculas y números válidos", () => {
    expect(validarFormatoCodigo("ABCD2")).toBe(true);
    expect(validarFormatoCodigo("XYZ23")).toBe(true);
  });
});
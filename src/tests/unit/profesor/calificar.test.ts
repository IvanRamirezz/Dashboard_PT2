// src/tests/unit/profesor/calificar.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../data/repositories/alumnoRepository", () => ({
  findAlumnoGrupo: vi.fn(),
}));

vi.mock("../../../data/repositories/grupoRepository", () => ({
  findGroupByIdAndTeacher: vi.fn(),
}));

vi.mock("../../../data/repositories/resultadoRepository", () => ({
  findResultado:    vi.fn(),
  updateResultado:  vi.fn(),
}));

import { findAlumnoGrupo }          from "../../../data/repositories/alumnoRepository";
import { findGroupByIdAndTeacher }   from "../../../data/repositories/grupoRepository";
import { findResultado, updateResultado } from "../../../data/repositories/resultadoRepository";

// Replica de teacherOwnsResult — función privada del endpoint
// la probamos de forma aislada con sus mismas dependencias
async function teacherOwnsResult(profesorId: number, alumnoId: number, practicaId: number) {
  const alumno = await findAlumnoGrupo(alumnoId);
  if (!alumno?.grupo_id) return false;

  const [grupo, resultado] = await Promise.all([
    findGroupByIdAndTeacher(alumno.grupo_id, profesorId),
    findResultado(alumnoId, practicaId),
  ]);

  return !!grupo && !!resultado;
}

describe("teacherOwnsResult — validación de ownership", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retorna true si el alumno es del grupo del profesor y tiene resultado", async () => {
    vi.mocked(findAlumnoGrupo).mockResolvedValue({ grupo_id: 10 } as any);
    vi.mocked(findGroupByIdAndTeacher).mockResolvedValue({ grupo_id: 10 } as any);
    vi.mocked(findResultado).mockResolvedValue({ resultado_id: 1 } as any);

    const result = await teacherOwnsResult(5, 20, 3);
    expect(result).toBe(true);
  });

  it("retorna false si el alumno no pertenece a ningún grupo", async () => {
    vi.mocked(findAlumnoGrupo).mockResolvedValue(null);

    const result = await teacherOwnsResult(5, 20, 3);
    expect(result).toBe(false);
    expect(findGroupByIdAndTeacher).not.toHaveBeenCalled();
  });

  it("retorna false si el grupo no pertenece al profesor", async () => {
    vi.mocked(findAlumnoGrupo).mockResolvedValue({ grupo_id: 10 } as any);
    vi.mocked(findGroupByIdAndTeacher).mockResolvedValue(null);
    vi.mocked(findResultado).mockResolvedValue({ resultado_id: 1 } as any);

    const result = await teacherOwnsResult(5, 20, 3);
    expect(result).toBe(false);
  });

  it("retorna false si el resultado no existe para ese alumno y práctica", async () => {
    vi.mocked(findAlumnoGrupo).mockResolvedValue({ grupo_id: 10 } as any);
    vi.mocked(findGroupByIdAndTeacher).mockResolvedValue({ grupo_id: 10 } as any);
    vi.mocked(findResultado).mockResolvedValue(null);

    const result = await teacherOwnsResult(5, 20, 3);
    expect(result).toBe(false);
  });

  it("no permite que profesor A califique resultado del alumno de profesor B", async () => {
    vi.mocked(findAlumnoGrupo).mockResolvedValue({ grupo_id: 99 } as any);
    // grupo 99 pertenece a otro profesor — devuelve null para el profesor actual
    vi.mocked(findGroupByIdAndTeacher).mockResolvedValue(null);
    vi.mocked(findResultado).mockResolvedValue({ resultado_id: 7 } as any);

    const result = await teacherOwnsResult(5, 20, 3);
    expect(result).toBe(false);
  });
});

describe("parseBody — validación de payload de calificación", () => {
  function parseBody(body: unknown) {
    if (!body || typeof body !== "object") return null;
    const { alumno_id, practica_id, calificacion, respuestas_json } = body as Record<string, unknown>;
    if (!alumno_id || !practica_id)            return null;
    if (typeof calificacion !== "number")       return null;
    if (!Number.isFinite(calificacion))         return null;
    if (calificacion < 0 || calificacion > 10) return null;
    if (respuestas_json !== undefined &&
      (typeof respuestas_json !== "object" || respuestas_json === null || Array.isArray(respuestas_json))
    ) return null;
    return {
      alumno_id:       Number(alumno_id),
      practica_id:     Number(practica_id),
      calificacion,
      respuestas_json: (respuestas_json ?? {}) as Record<string, unknown>,
    };
  }

  it("acepta payload válido completo", () => {
    const result = parseBody({
      alumno_id: 1, practica_id: 2, calificacion: 8.5,
      respuestas_json: { pregunta_1: { respuesta: "Monomodo", calificacion: 1 } },
    });
    expect(result).not.toBeNull();
    expect(result?.calificacion).toBe(8.5);
  });

  it("rechaza calificación fuera del rango 0-10", () => {
    expect(parseBody({ alumno_id: 1, practica_id: 1, calificacion: 11 })).toBeNull();
    expect(parseBody({ alumno_id: 1, practica_id: 1, calificacion: -1 })).toBeNull();
  });

  it("rechaza calificación NaN o Infinity", () => {
    expect(parseBody({ alumno_id: 1, practica_id: 1, calificacion: NaN })).toBeNull();
    expect(parseBody({ alumno_id: 1, practica_id: 1, calificacion: Infinity })).toBeNull();
  });

  it("rechaza si falta alumno_id o practica_id", () => {
    expect(parseBody({ practica_id: 1, calificacion: 5 })).toBeNull();
    expect(parseBody({ alumno_id: 1,   calificacion: 5 })).toBeNull();
  });

  it("rechaza si respuestas_json es un array", () => {
    expect(parseBody({ alumno_id: 1, practica_id: 1, calificacion: 5, respuestas_json: [] })).toBeNull();
  });
});
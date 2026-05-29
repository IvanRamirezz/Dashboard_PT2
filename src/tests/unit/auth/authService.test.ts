// src/tests/unit/auth/authService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted garantiza que signUpMock se inicializa ANTES del hoisting de vi.mock
const { signUpMock } = vi.hoisted(() => ({
  signUpMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: { signUp: signUpMock },
  })),
}));

vi.mock("../../../data/client/supabaseAdmin", () => ({
  supabaseAdmin: {
    rpc:  vi.fn(),
    from: vi.fn(),
    auth: { admin: { deleteUser: vi.fn() } },
  },
}));

vi.mock("../../../data/repositories/userRepository", () => ({
  createUsuario:  vi.fn(),
  createAlumno:   vi.fn(),
  createProfesor: vi.fn(),
}));

import { supabaseAdmin } from "../../../data/client/supabaseAdmin";
import * as userRepo from "../../../data/repositories/userRepository";
import { registerUser, type RegisterPayload } from "../../../business/auth/authService";

const basePayload: RegisterPayload = {
  email:           "test@example.com",
  password:        "Secret123!",
  passwordConfirm: "Secret123!",
  nombre:          "Juan",
  apellidoPaterno: "García",
  apellidoMaterno: "López",
  role:            "student",
  boleta:          "2021600001",
  baseUrl:         "http://localhost:4321",
};

function mockRegistroExitoso() {
  vi.mocked(supabaseAdmin.rpc).mockResolvedValueOnce({ data: null, error: null } as any);

  vi.mocked(supabaseAdmin.from).mockReturnValue({
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null }),
    }),
  } as any);

  signUpMock.mockResolvedValue({
    data:  { user: { id: "uid-abc" }, session: null },
    error: null,
  });
}

describe("registerUser — detección de duplicados", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lanza EMAIL_EXISTS si el email ya está en Auth", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValueOnce({
      data: "existing-uid-123", error: null,
    } as any);

    await expect(registerUser(basePayload)).rejects.toThrow("EMAIL_EXISTS");
  });

  it("lanza DATA_EXISTS si la boleta ya existe en BD", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValueOnce({ data: null, error: null } as any);

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: { alumno_id: 1 }, error: null }),
        }),
      }),
    } as any);

    await expect(registerUser(basePayload)).rejects.toThrow("DATA_EXISTS");
  });
});

describe("registerUser — rollback ante fallos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("llama deleteUser si createUsuario falla después del signUp", async () => {
    mockRegistroExitoso();

    vi.mocked(userRepo.createUsuario).mockRejectedValue(new Error("DB error"));

    const deleteUserSpy = vi.mocked(supabaseAdmin.auth.admin.deleteUser);

    await expect(registerUser(basePayload)).rejects.toThrow();
    expect(deleteUserSpy).toHaveBeenCalledWith("uid-abc");
  });

  it("no llama deleteUser si el fallo ocurre antes del signUp", async () => {
    vi.mocked(supabaseAdmin.rpc).mockResolvedValueOnce({
      data: "uid-existente", error: null,
    } as any);

    const deleteUserSpy = vi.mocked(supabaseAdmin.auth.admin.deleteUser);

    await expect(registerUser(basePayload)).rejects.toThrow("EMAIL_EXISTS");
    expect(deleteUserSpy).not.toHaveBeenCalled();
  });
});
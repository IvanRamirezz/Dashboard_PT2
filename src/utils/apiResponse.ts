// src/utils/apiResponse.ts

export function apiError(message: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function apiOk(data?: unknown): Response {
  return new Response(JSON.stringify({ ok: true, data: data ?? null }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function apiRedirect(url: URL | string, status: 303 | 302 = 303): Response {
  return new Response(null, {
    status,
    headers: { location: url.toString() },
  });
}
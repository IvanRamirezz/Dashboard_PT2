# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Production build
npm run preview   # Preview production build

npm run test          # Run Vitest unit tests
npm run test:watch    # Watch mode

npx playwright test   # Run e2e tests (src/tests/e2e/)
```

Environment: copy `.env.example` to `.env.local` and fill in Supabase credentials.

## Architecture

Three-layer architecture with strict separation:

```
src/
├── presentation/    # UI — Astro components, layouts, client-side scripts
├── business/        # Domain logic — services grouped by role (admin, profesor, auth)
├── data/            # DB access — Supabase clients + repositories per entity
├── pages/           # Astro file-based routes
│   ├── api/         # POST endpoints (formData + 303 redirect pattern)
│   ├── auth/        # Public auth flows
│   └── dashboard/   # Role-protected views
├── middleware.ts    # Route guard + injects locals.user / locals.roleData
└── utils/           # Shared helpers (apiResponse, etc.)
```

**Data flows top-down**: pages call business services, services call data repositories. Repositories call Supabase directly and never contain business rules.

### Supabase clients

Two clients in `src/data/client/`:
- **SSR client** — per-request, reads cookies, used for all user-facing operations
- **Admin client** — service role key, used only in business layer for privileged writes (e.g., creating auth users during registration)

### Middleware (`src/middleware.ts`)

Runs on every request. Sets `context.locals.user` (Supabase User) and `context.locals.roleData` (role, estado, usuarioId, nombre). Enforces:
- `/dashboard/admin`, `/api/admin` → requires role `admin`
- `/dashboard/profesor`, `/api/profesor` → requires role `profesor` with `estado: aprobado`
- Teachers with pending/rejected status are redirected with a query param explaining why

### API endpoints

All in `src/pages/api/`. Pattern: read `formData()`, call a service, return `303` redirect or JSON `{ ok, error?, data? }`. Protected by middleware — unauthorized requests get 401/403 before reaching the handler.

### Auth & registration flow

`authService.ts` orchestrates multi-step registration with rollback: creates the Supabase auth user, then inserts role-specific profile data. On failure at any step, previously created records are deleted. Custom error codes like `EMAIL_EXISTS`, `DATA_EXISTS`, `AUTH_UID_MISSING` are thrown and caught at the API layer.

### Role system

Three roles: `admin`, `profesor`, `alumno`. Teachers have an `estado` field (`pendiente` → `aprobado` / `rechazado`). Admins approve/reject teachers. Students join groups via 5-char access codes.

### Group codes

Generated in `groupService.ts`: 5 characters drawn from `[A-Z]` minus `O` and `I`, plus digits `2–9` (avoids ambiguous characters `0`, `1`).

### School year (ciclo escolar)

Computed from current date: months 1–5 → period `2`, months 6–12 → period `1`. Format: `YYYY-P` (e.g., `2026-2`).

## Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | public | Client-side anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | Admin operations |

## Testing

- **Unit tests** (`src/tests/unit/`, Vitest): pure logic — code generation, date calculations, service functions
- **E2E tests** (`src/tests/e2e/`, Playwright): login flows, role-based route protection, registration

## Database schema

The Supabase/PostgreSQL database schema is documented in:

@docs/database/schema.sql

Use this file as the source of truth for:
- tables
- columns
- relationships
- enums
- RLS policies
- database functions

Do not invent table names, column names, relationships or policies.
All Supabase queries, repositories and services must follow this schema.

Business rules:
@docs/database/database-rules.md
# Dashboard Web

Aplicacion web construida con Astro para autenticacion, gestion de usuarios, grupos y flujo de trabajo de administradores y profesores, usando Supabase como backend.

## Requisitos

- Node.js 24 recomendado
- npm
- Un proyecto de Supabase con las tablas y politicas necesarias

## Instalacion

```bash
git clone https://github.com/IvanRamirezz/Dashboard_PT2.git
cd Dashboard_PT2
npm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raiz del proyecto a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Configura estas variables:

```env
PUBLIC_SUPABASE_URL=tu_url_de_supabase
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Notas importantes:

- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` se usan en cliente y servidor.
- `SUPABASE_SERVICE_ROLE_KEY` solo debe usarse en el servidor y nunca exponerse al frontend.
- `.env` y `.env.local` no deben subirse al repositorio.

## Desarrollo

Inicia el entorno local con:

```bash
npm run dev
```

La app queda disponible en `http://localhost:4321`.

## Build

Para compilar el proyecto:

```bash
npm run build
```

Para previsualizar el resultado del build:

```bash
npm run preview
```

## Autenticacion y recuperacion de contrasena

- El login y la validacion de sesiones dependen de Supabase Auth.
- La recuperacion de contrasena redirige a `/auth/update-password` usando la URL actual de la peticion.
- En Supabase debes permitir la URL de desarrollo y produccion correspondiente en la configuracion de redirecciones de Auth.

Ejemplo para desarrollo:

```text
http://localhost:4321/auth/update-password
```

## Stack

- Astro
- TypeScript
- Supabase
- Vercel adapter para despliegue server-side

## Estructura general

```text
src/
├── components/
├── layouts/
├── lib/
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── profesor/
│   └── users/
└── pages/
    ├── api/
    ├── auth/
    └── dashboard/
```

## Notas

- El proyecto se compila con `output: "server"` y usa `@astrojs/vercel`.
- Si despliegas en Vercel, usa una version de Node compatible con el runtime configurado.

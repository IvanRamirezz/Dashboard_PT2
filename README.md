# Dashboard_PT2

Aplicación web desarrollada con Astro para la gestión de usuarios, grupos y autenticación, utilizando Supabase como backend.

---

## 🚀 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/IvanRamirezz/Dashboard_PT2.git
cd Dashboard_PT2
```

Instalar dependencias:

```bash
npm install
```

---

## 🔐 Variables de entorno

Este proyecto utiliza variables de entorno para manejar credenciales de Supabase.

1. Crea un archivo `.env.local` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env.local
```

2. Completa las variables necesarias:

```env
PUBLIC_SUPABASE_URL=tu_url_de_supabase
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

⚠️ **Importante:**

* No subas archivos `.env` o `.env.local` al repositorio
* No compartas tus credenciales
* Regenera tus keys si crees que fueron expuestas

---

## ▶️ Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en:

```
http://localhost:4321
```

---

## 🧠 Tecnologías utilizadas

* Astro
* TypeScript
* Supabase

---

## 📁 Estructura del proyecto

```text
src/
├── components/
├── modules/
│   ├── auth/
│   └── profesor/
├── pages/
│   └── api/
```

---

## 📌 Notas

Este proyecto forma parte del PT2 y tiene fines académicos.

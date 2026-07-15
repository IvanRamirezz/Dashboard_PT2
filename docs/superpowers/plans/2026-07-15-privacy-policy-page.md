# Privacy Policy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated, static `/legal/privacidad` page with FiberLab VR's Privacy Policy, linked from the login and registration screens.

**Architecture:** A new Astro page (`src/pages/legal/privacidad.astro`) wrapped in the existing base `Layout.astro`, styled by a new `legal.css` file that reuses the design tokens already defined in `variables.css`. Content is a hardcoded array of sections rendered with `.map()` — no CMS, no database, no dynamic data. Two existing files (`index.astro`, `RegisterForm.astro`) get a small link added.

**Tech Stack:** Astro (`.astro` files, TypeScript frontmatter), plain CSS with existing custom properties.

## Global Constraints

- Route must be exactly `/legal/privacidad` (spec-approved URL).
- Use `Layout.astro` (the plain base layout), not `AuthLayout.astro` — this is a reading document, not a form card.
- No new colors — only the custom properties already defined in `src/presentation/styles/variables.css`.
- Content column max-width ~700px, centered.
- Policy text must match the approved text verbatim (see spec `docs/superpowers/specs/2026-07-15-privacy-policy-page-design.md`) — do not paraphrase or reorder.
- No unit/e2e tests — this is static content with no logic. Verify manually via dev server + `curl`.
- Every task ends with a commit.

---

### Task 1: Privacy policy page + stylesheet

**Files:**
- Create: `src/presentation/styles/legal.css`
- Create: `src/pages/legal/privacidad.astro`

**Interfaces:**
- Consumes: `Layout.astro` (`src/presentation/layouts/Layout.astro`, prop `title?: string`, renders `<slot />` inside `<body>`).
- Produces: public route `/legal/privacidad`. Later tasks link to this path as a plain string href — no exported symbols.

- [ ] **Step 1: Create the stylesheet**

Create `src/presentation/styles/legal.css`:

```css
/* ============================================================
   LEGAL — política de privacidad y documentos legales
   ============================================================ */

.legal-page {
  min-height: 100vh;
  padding: var(--sp-10) var(--sp-4);
  display: flex;
  justify-content: center;
  background: var(--bg-main);
}

.legal-content {
  width: 100%;
  max-width: 700px;
}

/* ── Encabezado ── */
.legal-header {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-8);
}

.legal-header img {
  width: 40px;
  height: 40px;
}

.legal-back {
  font-size: var(--font-sm);
  color: var(--text-muted);
  transition: color var(--transition);
}

.legal-back:hover {
  color: var(--text-main);
  text-decoration: underline;
}

.legal-title {
  font-size: var(--font-2xl);
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: var(--sp-2);
  line-height: 1.2;
}

.legal-updated {
  font-size: var(--font-sm);
  color: var(--text-muted);
  margin-bottom: var(--sp-8);
}

/* ── Secciones ── */
.legal-section {
  margin-bottom: var(--sp-8);
}

.legal-section h2 {
  font-size: var(--font-lg);
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: var(--sp-3);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid rgba(52,91,99,0.5);
}

.legal-section p {
  color: var(--text-main);
  font-size: var(--font-base);
  line-height: 1.7;
  margin-bottom: var(--sp-3);
}

.legal-section ul {
  list-style: disc;
  padding-left: var(--sp-6);
  margin-bottom: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.legal-section li {
  color: var(--text-main);
  font-size: var(--font-base);
  line-height: 1.7;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .legal-page   { padding: var(--sp-6) var(--sp-4); }
  .legal-title  { font-size: var(--font-xl); }
}
```

- [ ] **Step 2: Create the page**

Create `src/pages/legal/privacidad.astro`:

```astro
---
// src/pages/legal/privacidad.astro
import Layout from "../../presentation/layouts/Layout.astro";
import "../../presentation/styles/legal.css";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

type Section = {
  title: string;
  blocks: Block[];
};

const sections: Section[] = [
  {
    title: "1. Introducción",
    blocks: [
      {
        type: "p",
        text: 'FiberLab VR ("la Aplicación") es una plataforma educativa desarrollada para apoyar el aprendizaje de prácticas de fibra óptica mediante un entorno de realidad virtual. La presente Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información de los usuarios.',
      },
      {
        type: "p",
        text: "Al utilizar la aplicación, aceptas las prácticas descritas en esta política.",
      },
    ],
  },
  {
    title: "2. Información que recopilamos",
    blocks: [
      { type: "p", text: "FiberLab VR puede recopilar la siguiente información:" },
      {
        type: "ul",
        items: [
          "Nombre del usuario.",
          "Dirección de correo electrónico.",
          "Identificador de usuario.",
          "Resultados de las prácticas realizadas.",
          "Calificaciones obtenidas.",
          "Progreso del usuario dentro de la aplicación.",
        ],
      },
      { type: "p", text: "No recopilamos información financiera ni datos biométricos." },
    ],
  },
  {
    title: "3. Uso de la información",
    blocks: [
      { type: "p", text: "La información recopilada se utiliza para:" },
      {
        type: "ul",
        items: [
          "Autenticar el acceso del usuario.",
          "Permitir el uso de la plataforma educativa.",
          "Registrar el progreso durante las prácticas.",
          "Mostrar calificaciones y resultados.",
          "Permitir a los instructores consultar el desempeño académico.",
          "Mejorar la calidad y estabilidad de la aplicación.",
        ],
      },
    ],
  },
  {
    title: "4. Almacenamiento de la información",
    blocks: [
      {
        type: "p",
        text: "La información se almacena de forma segura utilizando Supabase, una plataforma de servicios en la nube que proporciona autenticación y almacenamiento de bases de datos.",
      },
      {
        type: "p",
        text: "Se implementan medidas razonables para proteger la información contra accesos no autorizados, pérdida o alteración.",
      },
    ],
  },
  {
    title: "5. Compartición de la información",
    blocks: [
      { type: "p", text: "FiberLab VR no vende ni comercializa la información personal de sus usuarios." },
      { type: "p", text: "Los datos únicamente pueden compartirse con:" },
      {
        type: "ul",
        items: [
          "Supabase, como proveedor de infraestructura tecnológica.",
          "Los instructores autorizados para fines exclusivamente académicos.",
          "Autoridades competentes cuando exista una obligación legal.",
        ],
      },
    ],
  },
  {
    title: "6. Conservación de los datos",
    blocks: [
      {
        type: "p",
        text: "Los datos personales se conservarán únicamente durante el tiempo necesario para proporcionar los servicios educativos o mientras exista una relación activa con la institución educativa correspondiente.",
      },
    ],
  },
  {
    title: "7. Derechos del usuario",
    blocks: [
      { type: "p", text: "Los usuarios pueden solicitar:" },
      {
        type: "ul",
        items: [
          "Acceso a sus datos personales.",
          "Corrección de información incorrecta.",
          "Eliminación de sus datos personales cuando sea aplicable.",
          "Información sobre el tratamiento de sus datos.",
        ],
      },
      {
        type: "p",
        text: "Las solicitudes podrán realizarse mediante el correo electrónico indicado en la sección de contacto.",
      },
    ],
  },
  {
    title: "8. Seguridad",
    blocks: [
      {
        type: "p",
        text: "Implementamos medidas técnicas y organizativas para proteger la información almacenada contra accesos no autorizados, alteraciones o pérdidas.",
      },
      {
        type: "p",
        text: "Sin embargo, ningún método de transmisión o almacenamiento electrónico puede garantizar una seguridad absoluta.",
      },
    ],
  },
  {
    title: "9. Menores de edad",
    blocks: [
      {
        type: "p",
        text: "FiberLab VR está dirigida a estudiantes dentro de programas educativos y su uso se realiza bajo la supervisión de instituciones educativas e instructores.",
      },
    ],
  },
  {
    title: "10. Cambios a esta Política",
    blocks: [
      {
        type: "p",
        text: "Esta Política de Privacidad podrá actualizarse periódicamente para reflejar cambios en la aplicación o en la legislación aplicable.",
      },
      {
        type: "p",
        text: "La fecha de la última actualización aparecerá al inicio de este documento.",
      },
    ],
  },
  {
    title: "11. Contacto",
    blocks: [
      {
        type: "p",
        text: "Si tienes preguntas relacionadas con esta Política de Privacidad o deseas ejercer alguno de tus derechos, puedes comunicarte a través del siguiente correo electrónico:",
      },
      { type: "p", text: "Correo electrónico: rmzivan510@gmail.com" },
    ],
  },
];
---

<Layout title="Política de Privacidad">
  <div class="legal-page">
    <div class="legal-content">
      <header class="legal-header">
        <img src="/images/LogoFiberLabvr.png" alt="FiberLab VR" />
        <a class="legal-back" href="/">← Volver</a>
      </header>

      <h1 class="legal-title">Política de Privacidad de FiberLab VR</h1>
      <p class="legal-updated">Última actualización: 15 de julio de 2026</p>

      {sections.map((section) => (
        <section class="legal-section">
          <h2>{section.title}</h2>
          {section.blocks.map((block) =>
            block.type === "ul" ? (
              <ul>
                {block.items.map((item) => <li>{item}</li>)}
              </ul>
            ) : (
              <p>{block.text}</p>
            )
          )}
        </section>
      ))}
    </div>
  </div>
</Layout>
```

- [ ] **Step 3: Verify the page renders**

Run:
```bash
npm run dev &
sleep 3
curl -s http://localhost:4321/legal/privacidad | grep -o "Política de Privacidad de FiberLab VR"
curl -s http://localhost:4321/legal/privacidad | grep -o "rmzivan510@gmail.com"
kill %1
```
Expected: both `curl` calls print a match (no empty output), confirming the title and the contact section rendered. No Astro error overlay in the HTML (no `"An error occurred"` string in the output).

- [ ] **Step 4: Commit**

```bash
git add src/presentation/styles/legal.css src/pages/legal/privacidad.astro
git commit -m "feat: add privacy policy page at /legal/privacidad"
```

---

### Task 2: Link from login page

**Files:**
- Modify: `src/pages/index.astro:67-69` (the `forgot-link` paragraph, right after it)

**Interfaces:**
- Consumes: route `/legal/privacidad` from Task 1, and the existing `.forgot-link` CSS class from `src/presentation/styles/auth.css:186-197` (no changes needed to that file — the class is generic enough to reuse as-is).

- [ ] **Step 1: Add the link**

In `src/pages/index.astro`, the file currently ends with:

```astro
    <p class="forgot-link">
      <a href="/auth/forgot-password">¿Olvidaste tu contraseña?</a>
    </p>

  </form>
</AuthLayout>
```

Replace it with:

```astro
    <p class="forgot-link">
      <a href="/auth/forgot-password">¿Olvidaste tu contraseña?</a>
    </p>

    <p class="forgot-link">
      <a href="/legal/privacidad">Política de Privacidad</a>
    </p>

  </form>
</AuthLayout>
```

- [ ] **Step 2: Verify the link is present**

Run:
```bash
npm run dev &
sleep 3
curl -s http://localhost:4321/ | grep -o 'href="/legal/privacidad"'
kill %1
```
Expected: prints `href="/legal/privacidad"`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: link privacy policy from login page"
```

---

### Task 3: Link from registration form

**Files:**
- Modify: `src/presentation/components/auth/RegisterForm.astro:99-107` (after the submit button, still inside `.card`)
- Modify: `src/presentation/styles/register.css` (add `.privacy-link` rule)

**Interfaces:**
- Consumes: route `/legal/privacidad` from Task 1. `RegisterForm.astro` is rendered by both `src/pages/auth/register.astro` and `src/pages/auth/register-teacher.astro`, both of which already import `register.css` — no import changes needed there.

- [ ] **Step 1: Add the CSS rule**

In `src/presentation/styles/register.css`, after the `.btn:active` rule (ends at line 129) and before the `FEEDBACK` section comment (line 131), add:

```css
/* ── Link a política de privacidad ── */
.privacy-link {
  text-align: center;
  margin-top: var(--sp-4);
  font-size: var(--font-sm);
  color: var(--text-muted);
}

.privacy-link a {
  color: var(--text-muted);
  text-decoration: underline;
  transition: color var(--transition);
}

.privacy-link a:hover {
  color: var(--text-main);
}
```

- [ ] **Step 2: Add the link markup**

In `src/presentation/components/auth/RegisterForm.astro`, the file currently ends with:

```astro
      <button class="btn">
        Crear cuenta →
      </button>

    </form>
  </div>

</section>
```

Replace it with:

```astro
      <button class="btn">
        Crear cuenta →
      </button>

    </form>

    <p class="privacy-link">
      Al registrarte, aceptas nuestra <a href="/legal/privacidad">Política de Privacidad</a>.
    </p>

  </div>

</section>
```

- [ ] **Step 3: Verify the link is present on both registration pages**

Run:
```bash
npm run dev &
sleep 3
curl -s http://localhost:4321/auth/register | grep -o 'href="/legal/privacidad"'
curl -s http://localhost:4321/auth/register-teacher | grep -o 'href="/legal/privacidad"'
kill %1
```
Expected: both `curl` calls print `href="/legal/privacidad"`.

- [ ] **Step 4: Commit**

```bash
git add src/presentation/styles/register.css src/presentation/components/auth/RegisterForm.astro
git commit -m "feat: link privacy policy from registration form"
```

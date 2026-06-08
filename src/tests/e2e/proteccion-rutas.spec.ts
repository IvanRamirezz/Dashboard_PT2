// src/tests/e2e/proteccion-rutas.spec.ts
import { test, expect } from '@playwright/test';

const URL = 'https://dashboard-web-six-umber.vercel.app';

// ─── helpers ────────────────────────────────────────────────────────────────

async function loginComo(page: any, email: string, password: string) {
  await page.goto(URL);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/dashboard|error/);
}

// ─── BLOQUE 1: sin sesión — acceso a páginas ────────────────────────────────

test.describe('Sin sesión — páginas protegidas redirigen al login', () => {

  test('GET /dashboard/profesor redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/profesor`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

  test('GET /dashboard/profesor/asignar redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/profesor/asignar`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

  test('GET /dashboard/profesor/calificar redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/profesor/calificar`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

  test('GET /dashboard/profesor/gestionar-grupos redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/profesor/gestionar-grupos`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

  test('GET /dashboard/admin redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/admin`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

  test('GET /dashboard/admin/profesores redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/admin/profesores`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

  test('GET /dashboard/admin/alumnos redirige a /', async ({ page }) => {
    await page.goto(`${URL}/dashboard/admin/alumnos`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

});

// ─── BLOQUE 2: sin sesión — endpoints API devuelven 401 JSON ────────────────

test.describe('Sin sesión — APIs devuelven 401 con JSON', () => {

  test('POST /api/profesor/asignar rechaza sin sesión', async ({ request }) => {
    const res = await request.post(`${URL}/api/profesor/asignar`, {
      form: { practica_id: '1', grupo_id: '1', fecha_fin: '2099-12-31' }
    });
    expect([401, 403]).toContain(res.status());
  });

  test('POST /api/profesor/gestionar-grupos rechaza sin sesión', async ({ request }) => {
    const res = await request.post(`${URL}/api/profesor/gestionar-grupos`, {
      form: { action: 'alta', grupo: 'TEST' }
    });
    expect([401, 403]).toContain(res.status());
  });

  test('POST /api/admin/update-teacher-status rechaza sin sesión', async ({ request }) => {
    const res = await request.post(`${URL}/api/admin/update-teacher-status`, {
      form: { profesor_id: '1', estado: 'aprobado' }
    });
    expect([401, 403]).toContain(res.status());
  });

  test('POST /api/admin/delete-student rechaza sin sesión', async ({ request }) => {
    const res = await request.post(`${URL}/api/admin/delete-student`, {
      form: { alumno_id: '1' }
    });
    expect([401, 403]).toContain(res.status());
  });

});

// ─── BLOQUE 3: acceso cruzado entre roles ───────────────────────────────────

test.describe('Acceso cruzado — un rol no puede usar rutas del otro', () => {

  test('Profesor no puede acceder a /dashboard/admin', async ({ page }) => {
  await loginComo(page, 'profe@gmail.com', 'prueba12');
  await page.goto(`${URL}/dashboard/admin`);
  // el middleware redirige al dashboard propio, no al raíz
  await expect(page).not.toHaveURL(/dashboard\/admin/);
  await expect(page).toHaveURL(/dashboard\/profesor/);
});

  test('Profesor no puede llamar a API de admin', async ({ page, request }) => {
    await loginComo(page, 'profe@gmail.com', 'prueba12');

    // extrae cookies de la sesión del profesor
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const res = await request.post(`${URL}/api/admin/update-teacher-status`, {
      headers: { Cookie: cookieHeader },
      form: { profesor_id: '1', estado: 'aprobado' }
    });
    // middleware devuelve 403 cuando hay sesión pero rol incorrecto
    expect(res.status()).toBe(403);
  });

  test('Admin no puede acceder a /dashboard/profesor', async ({ page }) => {
  await loginComo(page, 'admin@admin.com', 'prueba12');
  await page.goto(`${URL}/dashboard/profesor`);
  await expect(page).not.toHaveURL(/dashboard\/profesor/);
  await expect(page).toHaveURL(/dashboard\/admin/);
});

});

// ─── BLOQUE 4: profesor pendiente ───────────────────────────────────────────

test.describe('Profesor pendiente — sesión válida pero sin acceso', () => {

  // necesitas una cuenta de profesor con estado=pendiente en tu BD de pruebas
  test('Profesor pendiente ve error=pendiente', async ({ page }) => {
    await page.goto(URL);
    await page.fill('input[type="email"]', 'prueba4@gmail.com'); // ← aquí
    await page.fill('input[type="password"]', 'prueba12');        // ← aquí
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/error=pendiente/);
  });

  test('Profesor pendiente no puede acceder directo a /dashboard/profesor', async ({ page }) => {
    // aunque conozca la URL, el middleware lo bloquea
    await page.goto(`${URL}/dashboard/profesor`);
    await expect(page).toHaveURL(/^https:\/\/dashboard-web-six-umber\.vercel\.app\/?$/);
  });

});
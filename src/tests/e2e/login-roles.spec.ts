import { test, expect } from '@playwright/test';

const URL = 'https://dashboard-web-six-umber.vercel.app';

test.describe('Control de acceso por roles', () => {

  test('Administrador accede al dashboard admin', async ({ page }) => {

    await page.goto(URL);

    await page.fill('input[type="email"]', 'admin@admin.com');
    await page.fill('input[type="password"]', 'prueba12');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard\/admin/);

  });

  test('Profesor accede al dashboard profesor', async ({ page }) => {

    await page.goto(URL);

    await page.fill('input[type="email"]', 'profe@gmail.com');
    await page.fill('input[type="password"]', 'prueba12');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard\/profesor/);

  });

  test('Alumno no tiene acceso al sistema', async ({ page }) => {

    await page.goto(URL);

    await page.fill('input[type="email"]', 'alumno@gmail.com');
    await page.fill('input[type="password"]', 'prueba13');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/error=no_access/);

  });

  test('Credenciales incorrectas muestran error', async ({ page }) => {

    await page.goto(URL);

    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', 'incorrecta');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/error=credenciales/);

  });

  test('Campos de login visibles', async ({ page }) => {

    await page.goto(URL);

    await expect(
      page.locator('input[type="email"]')
    ).toBeVisible();

    await expect(
      page.locator('input[type="password"]')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Login' })
    ).toBeVisible();

  });

});
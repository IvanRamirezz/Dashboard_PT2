import { test, expect } from '@playwright/test';

test('Registro de profesor y validación de cuenta no verificada', async ({ page }) => {

  const timestamp = Date.now();

  const correo = `profesor${timestamp}@test.com`;

  await page.goto(
    'https://dashboard-web-six-umber.vercel.app/auth/register-teacher'
  );

  await page.getByPlaceholder('Ingresa tu nombre')
    .fill('Profesor');

  await page.getByPlaceholder('Ingresa tu apellido paterno')
    .fill('Prueba');

  await page.getByPlaceholder('Ingresa tu apellido materno')
    .fill('Automation');

  await page.getByPlaceholder('Ingresa tu número de profesor')
    .fill(`PROF${timestamp}`);

  await page.getByPlaceholder('Ingresa tu correo')
    .fill(correo);

  await page.getByPlaceholder('Crea una contraseña')
    .fill('Prueba123*');

  await page.getByPlaceholder('Confirma tu contraseña')
    .fill('Prueba123*');

  await page.getByRole('button', {
    name: /crear cuenta/i
  }).click();

  await page.waitForTimeout(3000);

  await page.goto(
    'https://dashboard-web-six-umber.vercel.app'
  );

  await page.fill(
    'input[type="email"]',
    correo
  );

  await page.fill(
    'input[type="password"]',
    'Prueba123*'
  );

  await page.getByRole('button', {
    name: 'Login'
  }).click();

  await expect(page)
    .toHaveURL(/error=credenciales/);

});
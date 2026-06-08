import { test, expect } from '@playwright/test';

test('Alumno no puede iniciar sesión sin verificar correo', async ({ page }) => {

  const timestamp = Date.now();

  const correo = `alumno${timestamp}@test.com`;

  // AQUÍ IRÍA EL REGISTRO DEL ALUMNO

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
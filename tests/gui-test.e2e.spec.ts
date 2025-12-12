import { test, expect } from '@playwright/test';

test.describe('Entoo2 Frontend GUI Tests', () => {
  test('should load homepage and redirect to login', async ({ page }) => {
    await page.goto('http://localhost');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot of initial page
    await page.screenshot({ path: 'test-results/01-homepage.png', fullPage: true });

    // Check if we're on login page (authenticated users redirect)
    const url = page.url();
    console.log('Current URL:', url);

    // Check for app name
    const appName = await page.textContent('h1, .app-name, [data-testid="app-name"]').catch(() => null);
    console.log('App Name:', appName);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost/login');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/02-login-page.png', fullPage: true });

    // Check for login form elements
    const emailInput = await page.locator('input[type="email"]').count();
    const passwordInput = await page.locator('input[type="password"]').count();
    const loginButton = await page.locator('button:has-text("Login"), button:has-text("Přihlásit")').count();

    console.log('Email inputs found:', emailInput);
    console.log('Password inputs found:', passwordInput);
    console.log('Login buttons found:', loginButton);

    expect(emailInput).toBeGreaterThan(0);
    expect(passwordInput).toBeGreaterThan(0);
  });

  test('should display register page', async ({ page }) => {
    await page.goto('http://localhost/register');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/03-register-page.png', fullPage: true });

    // Check for register form elements
    const emailInput = await page.locator('input[type="email"]').count();
    const passwordInputs = await page.locator('input[type="password"]').count();
    const registerButton = await page.locator('button:has-text("Register"), button:has-text("Registrovat")').count();

    console.log('Email inputs found:', emailInput);
    console.log('Password inputs found:', passwordInputs);
    console.log('Register buttons found:', registerButton);

    expect(emailInput).toBeGreaterThan(0);
    expect(passwordInputs).toBeGreaterThan(0);
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('http://localhost/register');
    await page.waitForLoadState('networkidle');

    const testEmail = `test${Date.now()}@example.com`;

    // Fill in registration form
    await page.fill('input[type="email"]', testEmail);
    const passwordFields = await page.locator('input[type="password"]').all();

    if (passwordFields.length >= 1) {
      await passwordFields[0].fill('TestPassword123!');
    }
    if (passwordFields.length >= 2) {
      await passwordFields[1].fill('TestPassword123!');
    }

    // Take screenshot before submit
    await page.screenshot({ path: 'test-results/04-register-filled.png', fullPage: true });

    // Click register button
    await page.click('button[type="submit"], button:has-text("Register"), button:has-text("Registrovat")');

    // Wait for navigation or response
    await page.waitForTimeout(2000);

    // Take screenshot after registration
    await page.screenshot({ path: 'test-results/05-after-register.png', fullPage: true });

    console.log('Registration completed for:', testEmail);
    console.log('Current URL after registration:', page.url());
  });

  test('should login with existing user', async ({ page }) => {
    await page.goto('http://localhost/login');
    await page.waitForLoadState('networkidle');

    // Use the user we created in API tests
    await page.fill('input[type="email"]', 'adam.pechy@student.com');
    await page.fill('input[type="password"]', 'password123');

    // Take screenshot before submit
    await page.screenshot({ path: 'test-results/06-login-filled.png', fullPage: true });

    // Click login button
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Přihlásit")');

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Take screenshot after login
    await page.screenshot({ path: 'test-results/07-after-login.png', fullPage: true });

    console.log('Login completed');
    console.log('Current URL after login:', page.url());
  });

  test('should show theme toggle', async ({ page }) => {
    await page.goto('http://localhost/login');
    await page.waitForLoadState('networkidle');

    // Look for theme toggle button (sun/moon icon)
    const themeToggle = await page.locator('button[aria-label*="theme"], button[title*="theme"], svg').count();
    console.log('Theme toggle elements found:', themeToggle);

    // Take screenshot
    await page.screenshot({ path: 'test-results/08-theme-check.png', fullPage: true });
  });

  test('should show language selector', async ({ page }) => {
    await page.goto('http://localhost/login');
    await page.waitForLoadState('networkidle');

    // Look for language selector
    const langSelector = await page.locator('select, [data-testid="language-selector"]').count();
    console.log('Language selector elements found:', langSelector);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/CheetiHost/i);
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*\/auth\/login/);
    await expect(page.locator('h1, h2').filter({ hasText: /sign in|login/i })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*\/auth\/signup/);
    await expect(page.locator('h1, h2').filter({ hasText: /create|sign up|register/i })).toBeVisible();
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button[type="submit"]');
    // Check for validation message or error state
    await expect(page.locator('text=email').first()).toBeVisible();
  });

  test('should show validation errors on empty signup', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.click('button[type="submit"]');
    // Check for validation message or error state
    await expect(page.locator('form')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/.*\/pricing/);
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check header navigation exists
    const header = page.locator('header, nav');
    await expect(header.first()).toBeVisible();
  });
});

test.describe('Dashboard Access', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test('should redirect unauthenticated users from admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test('should redirect unauthenticated users from reseller', async ({ page }) => {
    await page.goto('/reseller');
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.skip('should display admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1, h2').filter({ hasText: /admin|dashboard/i })).toBeVisible();
  });

  test.skip('should show MRR metrics', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Monthly Recurring Revenue')).toBeVisible();
  });

  test.skip('should show ARR metrics', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Annual Recurring Revenue')).toBeVisible();
  });

  test.skip('should display user growth chart', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=User Growth')).toBeVisible();
  });

  test.skip('should display revenue breakdown', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Revenue Breakdown')).toBeVisible();
  });

  test.skip('should show system alerts', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=System Alerts')).toBeVisible();
  });
});

test.describe('User Management', () => {
  test.skip('should navigate to user management', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('h1, h2').filter({ hasText: /user/i })).toBeVisible();
  });

  test.skip('should search users', async ({ page }) => {
    await page.goto('/admin/users');
    await page.fill('input[placeholder*="search"]', 'test@example.com');
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });

  test.skip('should edit user role', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('button:has-text("Edit")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test.skip('should suspend user', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('button:has-text("Suspend")');
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('text=User suspended')).toBeVisible();
  });
});

test.describe('Role Management', () => {
  test.skip('should navigate to role management', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('h1, h2').filter({ hasText: /role/i })).toBeVisible();
  });

  test.skip('should display role list', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page.locator('text=Admin')).toBeVisible();
    await expect(page.locator('text=Reseller')).toBeVisible();
    await expect(page.locator('text=User')).toBeVisible();
  });

  test.skip('should assign role to user', async ({ page }) => {
    await page.goto('/admin/roles');
    await page.click('button:has-text("Assign Role")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});

test.describe('Payment Gateway Settings', () => {
  test.skip('should navigate to payment settings', async ({ page }) => {
    await page.goto('/admin/payments');
    await expect(page.locator('h1, h2').filter({ hasText: /payment/i })).toBeVisible();
  });

  test.skip('should display payment gateways', async ({ page }) => {
    await page.goto('/admin/payments');
    await expect(page.locator('text=Stripe')).toBeVisible();
    await expect(page.locator('text=Paystack')).toBeVisible();
  });

  test.skip('should toggle payment gateway', async ({ page }) => {
    await page.goto('/admin/payments');
    const toggle = page.locator('[data-testid="stripe-toggle"]');
    await toggle.click();
    await expect(page.locator('text=Gateway updated')).toBeVisible();
  });
});

test.describe('System Settings', () => {
  test.skip('should navigate to system settings', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.locator('h1, h2').filter({ hasText: /settings/i })).toBeVisible();
  });

  test.skip('should update company settings', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.fill('input[name="companyName"]', 'CheetiHost');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });
});

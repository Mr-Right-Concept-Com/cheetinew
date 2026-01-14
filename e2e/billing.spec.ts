import { test, expect } from '@playwright/test';

test.describe('Billing Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.skip('should display billing page', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await expect(page.locator('h1, h2').filter({ hasText: /billing/i })).toBeVisible();
  });

  test.skip('should show subscription list', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await expect(page.locator('text=Subscriptions')).toBeVisible();
  });

  test.skip('should display invoice history', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('text=Invoices');
    await expect(page.locator('[data-testid="invoice-list"]')).toBeVisible();
  });

  test.skip('should download invoice PDF', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('text=Invoices');
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("PDF")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test.skip('should show payment methods', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('text=Payment Methods');
    await expect(page.locator('text=Visa')).toBeVisible();
  });
});

test.describe('Subscription Management', () => {
  test.skip('should change subscription plan', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('button:has-text("Change Plan")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test.skip('should cancel subscription', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Are you sure')).toBeVisible();
  });

  test.skip('should upgrade to annual billing', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('button:has-text("Annual")');
    await expect(page.locator('text=Save 20%')).toBeVisible();
  });
});

test.describe('Payment Methods', () => {
  test.skip('should add payment method', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('text=Payment Methods');
    await page.click('button:has-text("Add Payment Method")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test.skip('should set default payment method', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('text=Payment Methods');
    await page.click('button:has-text("Set Default")');
    await expect(page.locator('text=Default updated')).toBeVisible();
  });

  test.skip('should remove payment method', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.click('text=Payment Methods');
    await page.click('button:has-text("Remove")');
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('text=Payment method removed')).toBeVisible();
  });
});

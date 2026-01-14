import { test, expect } from '@playwright/test';

test.describe('Domain Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.skip('should display domains page', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await expect(page.locator('h1, h2').filter({ hasText: /domain/i })).toBeVisible();
  });

  test.skip('should search for domain availability', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await page.fill('input[placeholder*="search"]', 'example.com');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=available')).toBeVisible();
  });

  test.skip('should show domain list', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await expect(page.locator('[data-testid="domain-list"]')).toBeVisible();
  });

  test.skip('should open domain registration dialog', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await page.click('button:has-text("Register")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test.skip('should display DNS records', async ({ page }) => {
    await page.goto('/dashboard/domains');
    const firstDomain = page.locator('[data-testid="domain-item"]').first();
    await firstDomain.click();
    await expect(page.locator('text=DNS Records')).toBeVisible();
  });
});

test.describe('DNS Management', () => {
  test.skip('should add DNS record', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await page.click('button:has-text("Add Record")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    await page.fill('input[name="name"]', 'www');
    await page.selectOption('select[name="type"]', 'A');
    await page.fill('input[name="value"]', '192.168.1.1');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=Record added')).toBeVisible();
  });

  test.skip('should edit DNS record', async ({ page }) => {
    await page.goto('/dashboard/domains');
    const editButton = page.locator('[data-testid="edit-dns"]').first();
    await editButton.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test.skip('should delete DNS record', async ({ page }) => {
    await page.goto('/dashboard/domains');
    const deleteButton = page.locator('[data-testid="delete-dns"]').first();
    await deleteButton.click();
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('text=Record deleted')).toBeVisible();
  });
});

test.describe('Domain Transfer', () => {
  test.skip('should initiate domain transfer', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await page.click('button:has-text("Transfer")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test.skip('should validate auth code', async ({ page }) => {
    await page.goto('/dashboard/domains');
    await page.click('button:has-text("Transfer")');
    await page.fill('input[name="domain"]', 'example.com');
    await page.fill('input[name="authCode"]', 'INVALID');
    await page.click('button:has-text("Verify")');
    await expect(page.locator('text=Invalid auth code')).toBeVisible();
  });
});

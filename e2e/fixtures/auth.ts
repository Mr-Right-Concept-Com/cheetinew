import { test as base, expect, Page } from '@playwright/test';

// Test user credentials (would be set up in test environment)
export const TEST_USER = {
  email: 'test@cheetihost.com',
  password: 'TestPassword123!',
};

export const TEST_ADMIN = {
  email: 'admin@cheetihost.com',
  password: 'AdminPassword123!',
};

export const TEST_RESELLER = {
  email: 'reseller@cheetihost.com',
  password: 'ResellerPassword123!',
};

// Helper function to login
export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation after login
  await page.waitForURL(/\/(dashboard|admin|reseller)/);
}

// Helper function to logout
export async function logout(page: Page) {
  // Look for a logout button or menu item
  const userMenu = page.locator('[data-testid="user-menu"]');
  if (await userMenu.isVisible()) {
    await userMenu.click();
    await page.click('text=Logout');
  }
  await page.waitForURL('/');
}

// Extended test with authenticated fixtures
export const test = base.extend<{
  authenticatedPage: Page;
  adminPage: Page;
  resellerPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    await login(page, TEST_USER.email, TEST_USER.password);
    await use(page);
  },
  adminPage: async ({ page }, use) => {
    await login(page, TEST_ADMIN.email, TEST_ADMIN.password);
    await use(page);
  },
  resellerPage: async ({ page }, use) => {
    await login(page, TEST_RESELLER.email, TEST_RESELLER.password);
    await use(page);
  },
});

export { expect };

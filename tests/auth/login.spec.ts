import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../fixtures/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('should show error for locked out user', async () => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('should show error when username is empty', async () => {
    await loginPage.login('', USERS.standard.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('should show error when password is empty', async () => {
    await loginPage.login(USERS.standard.username, '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('should redirect to login page when accessing inventory without login', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
  });

  test('should login successfully as error_user', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.error_user.username, USERS.error_user.password);
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('should login successfully as visual_user', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.visual_user.username, USERS.visual_user.password);
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });
});

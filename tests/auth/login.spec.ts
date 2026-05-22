import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../fixtures/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    allure.epic('E-Commerce Platform');
    allure.feature('Authentication');
    allure.owner('Jack Taylor');
    allure.tag('regression');
    allure.tag('e2e');
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    allure.story('Valid login');
    allure.severity('critical');
    allure.tag('smoke');
    allure.description('Standard user should be able to log in and see 6 products on the inventory page.');

    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await allure.step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
    await allure.step('Verify 6 products are visible', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });

  test('should show error for locked out user', async () => {
    allure.story('Locked out user');
    allure.severity('critical');
    allure.tag('smoke');
    allure.description('A locked out user should see an appropriate error message and not be able to log in.');

    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    await allure.step('Verify error message is visible', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
    await allure.step('Verify error message contains "locked out"', async () => {
      await expect(loginPage.errorMessage).toContainText('locked out');
    });
  });

  test('should show error when username is empty', async () => {
    allure.story('Field validation');
    allure.severity('normal');
    allure.description('Submitting the login form with no username should show a validation error.');

    await loginPage.login('', USERS.standard.password);

    await allure.step('Verify username required error is shown', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username is required');
    });
  });

  test('should show error when password is empty', async () => {
    allure.story('Field validation');
    allure.severity('normal');
    allure.description('Submitting the login form with no password should show a validation error.');

    await loginPage.login(USERS.standard.username, '');

    await allure.step('Verify password required error is shown', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Password is required');
    });
  });

  test('should show error for invalid credentials', async () => {
    allure.story('Invalid credentials');
    allure.severity('critical');
    allure.description('A user entering the wrong password should see a credentials mismatch error.');

    await loginPage.login(USERS.standard.username, 'wrong_password');

    await allure.step('Verify credentials mismatch error is shown', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    });
  });

  test('should redirect to login page when accessing inventory without login', async ({ page }) => {
    allure.story('Unauthenticated access');
    allure.severity('critical');
    allure.tag('smoke');
    allure.description('Attempting to access the inventory page without being logged in should redirect to the login page.');

    await allure.step('Navigate directly to inventory page', async () => {
      await page.goto('/inventory.html');
    });
    await allure.step('Verify redirect back to login page', async () => {
      await expect(page).toHaveURL('/');
    });
  });

  test('should login successfully as error_user', async ({ page }) => {
    allure.story('Valid login');
    allure.severity('normal');
    allure.description('Error user should be able to log in and reach the inventory page.');

    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.error_user.username, USERS.error_user.password);

    await allure.step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
    await allure.step('Verify 6 products are visible', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });

  test('should login successfully as visual_user', async ({ page }) => {
    allure.story('Valid login');
    allure.severity('normal');
    allure.description('Visual user should be able to log in and reach the inventory page.');

    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.visual_user.username, USERS.visual_user.password);

    await allure.step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
    await allure.step('Verify 6 products are visible', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });
});

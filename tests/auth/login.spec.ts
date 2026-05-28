import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, tag, description, owner, step } from 'allure-js-commons';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../fixtures/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await epic('E-Commerce Platform');
    await feature('Authentication');
    await owner('Jack Taylor');
    await tag('regression');
    await tag('e2e');
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await story('Valid login');
    await severity('critical');
    await tag('smoke');
    await description(
      'Standard user should be able to log in and see 6 products on the inventory page.',
    );

    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
    await step('Verify 6 products are visible', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });

  test('should show error for locked out user', async () => {
    await story('Locked out user');
    await severity('critical');
    await tag('smoke');
    await description(
      'A locked out user should see an appropriate error message and not be able to log in.',
    );

    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    await step('Verify error message is visible', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
    await step('Verify error message contains "locked out"', async () => {
      await expect(loginPage.errorMessage).toContainText('locked out');
    });
  });

  test('should show error when username is empty', async () => {
    await story('Field validation');
    await severity('normal');
    await description('Submitting the login form with no username should show a validation error.');

    await loginPage.login('', USERS.standard.password);

    await step('Verify username required error is shown', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username is required');
    });
  });

  test('should show error when password is empty', async () => {
    await story('Field validation');
    await severity('normal');
    await description('Submitting the login form with no password should show a validation error.');

    await loginPage.login(USERS.standard.username, '');

    await step('Verify password required error is shown', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Password is required');
    });
  });

  test('should show error for invalid credentials', async () => {
    await story('Invalid credentials');
    await severity('critical');
    await description(
      'A user entering the wrong password should see a credentials mismatch error.',
    );

    await loginPage.login(USERS.standard.username, 'wrong_password');

    await step('Verify credentials mismatch error is shown', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    });
  });

  test('should redirect to login page when accessing inventory without login', async ({ page }) => {
    await story('Unauthenticated access');
    await severity('critical');
    await tag('smoke');
    await description(
      'Attempting to access the inventory page without being logged in should redirect to the login page.',
    );

    await step('Navigate directly to inventory page', async () => {
      await page.goto('/inventory.html');
    });
    await step('Verify redirect back to login page', async () => {
      await expect(page).toHaveURL('/');
    });
  });

  test('should login successfully as error_user', async ({ page }) => {
    await story('Valid login');
    await severity('normal');
    await description('Error user should be able to log in and reach the inventory page.');

    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.error_user.username, USERS.error_user.password);

    await step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
    await step('Verify 6 products are visible', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });

  test('should login successfully as visual_user', async ({ page }) => {
    await story('Valid login');
    await severity('normal');
    await description('Visual user should be able to log in and reach the inventory page.');

    const inventoryPage = new InventoryPage(page);
    await loginPage.login(USERS.visual_user.username, USERS.visual_user.password);

    await step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
    await step('Verify 6 products are visible', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });
});

import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, tag, description, owner, step } from 'allure-js-commons';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS } from '../../fixtures/users';

test.describe('Checkout', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    await epic('E-Commerce Platform');
    await feature('Checkout');
    await owner('Jack Taylor');
    await tag('regression');
    await tag('e2e');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await step('Verify user is on checkout step one', async () => {
      await expect(page).toHaveURL('/checkout-step-one.html');
    });
  });

  test('should complete a full checkout successfully', async ({ page }) => {
    await story('Happy path');
    await severity('critical');
    await tag('smoke');
    await description('A user should be able to complete the full checkout flow and see an order confirmation.');

    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    await step('Verify user is on order summary page', async () => {
      await expect(page).toHaveURL('/checkout-step-two.html');
    });

    await checkoutPage.finish();

    await step('Verify order confirmation is shown', async () => {
      await expect(page).toHaveURL('/checkout-complete.html');
      await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
    });
  });

  test('should display order summary before finishing', async ({ page }) => {
    await story('Order summary');
    await severity('normal');
    await description('The order summary page should display item total, tax, and order total before the user confirms.');

    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    await step('Verify order summary figures are visible', async () => {
      await expect(checkoutPage.itemTotal).toBeVisible();
      await expect(checkoutPage.taxAmount).toBeVisible();
      await expect(checkoutPage.orderTotal).toBeVisible();
    });
  });

  test('should show error when first name is missing', async () => {
    await story('Field validation');
    await severity('normal');
    await description('Submitting checkout info without a first name should show a validation error.');

    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.continue();

    await step('Verify first name required error is shown', async () => {
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });
  });

  test('should show error when last name is missing', async () => {
    await story('Field validation');
    await severity('normal');
    await description('Submitting checkout info without a last name should show a validation error.');

    await checkoutPage.fillShippingInfo('John', '', '12345');
    await checkoutPage.continue();

    await step('Verify last name required error is shown', async () => {
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    });
  });

  test('should show error when postal code is missing', async () => {
    await story('Field validation');
    await severity('normal');
    await description('Submitting checkout info without a postal code should show a validation error.');

    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.continue();

    await step('Verify postal code required error is shown', async () => {
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    });
  });
});

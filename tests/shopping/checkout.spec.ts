import { test, expect } from '@playwright/test';
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
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');
  });

  test('should complete a full checkout successfully', async ({ page }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL('/checkout-step-two.html');

    await checkoutPage.finish();
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('should display order summary before finishing', async ({ page }) => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    await expect(checkoutPage.itemTotal).toBeVisible();
    await expect(checkoutPage.taxAmount).toBeVisible();
    await expect(checkoutPage.orderTotal).toBeVisible();
  });

  test('should show error when first name is missing', async () => {
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('should show error when last name is missing', async () => {
    await checkoutPage.fillShippingInfo('John', '', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('should show error when postal code is missing', async () => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});

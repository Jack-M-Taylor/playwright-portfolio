import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { USERS } from '../../fixtures/users';

test.describe('Shopping Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should add a product to cart', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should add multiple products to cart', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('should remove a product from the inventory page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should display correct items in the cart page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(2);
  });

  test('should remove an item from the cart page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.removeItem('Sauce Labs Backpack');
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('should navigate back to inventory from cart', async ({ page }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL('/inventory.html');
  });
});

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { USERS } from '../../fixtures/users';

test.describe('Shopping Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    allure.suite('Shopping');
    allure.feature('Shopping Cart');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should add a product to cart', async () => {
    allure.story('Add to cart');
    allure.severity('critical');
    allure.description('Adding a product should increment the cart badge to 1.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should add multiple products to cart', async () => {
    allure.story('Add to cart');
    allure.severity('normal');
    allure.description('Adding two products should increment the cart badge to 2.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('should remove a product from the inventory page', async () => {
    allure.story('Remove from cart');
    allure.severity('normal');
    allure.description('Removing a product from the inventory page should hide the cart badge.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should display correct items in the cart page', async () => {
    allure.story('Cart contents');
    allure.severity('critical');
    allure.description('Items added from the inventory page should appear correctly in the cart.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(2);
  });

  test('should remove an item from the cart page', async () => {
    allure.story('Remove from cart');
    allure.severity('normal');
    allure.description('Removing an item from the cart page should leave the cart empty.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.removeItem('Sauce Labs Backpack');
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('should navigate back to inventory from cart', async ({ page }) => {
    allure.story('Navigation');
    allure.severity('minor');
    allure.description('Clicking continue shopping from the cart should return the user to the inventory page.');

    await inventoryPage.goToCart();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL('/inventory.html');
  });
});

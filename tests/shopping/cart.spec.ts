import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, tag, description, owner, step } from 'allure-js-commons';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { USERS } from '../../fixtures/users';

test.describe('Shopping Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    await epic('E-Commerce Platform');
    await feature('Shopping Cart');
    await owner('Jack Taylor');
    await tag('regression');
    await tag('e2e');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await step('Verify user is on inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test('should add a product to cart', async () => {
    await story('Add to cart');
    await severity('critical');
    await tag('smoke');
    await description('Adding a product should increment the cart badge to 1.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');

    await step('Verify cart badge shows 1', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });
  });

  test('should add multiple products to cart', async () => {
    await story('Add to cart');
    await severity('normal');
    await description('Adding two products should increment the cart badge to 2.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');

    await step('Verify cart badge shows 2', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('2');
    });
  });

  test('should remove a product from the inventory page', async () => {
    await story('Remove from cart');
    await severity('normal');
    await description('Removing a product from the inventory page should hide the cart badge.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');

    await step('Verify cart badge is no longer visible', async () => {
      await expect(inventoryPage.cartBadge).toBeHidden();
    });
  });

  test('should display correct items in the cart page', async () => {
    await story('Cart contents');
    await severity('critical');
    await tag('smoke');
    await description('Items added from the inventory page should appear correctly in the cart.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    await step('Verify cart contains 2 items', async () => {
      await expect(cartPage.cartItems).toHaveCount(2);
    });
  });

  test('should remove an item from the cart page', async () => {
    await story('Remove from cart');
    await severity('normal');
    await description('Removing an item from the cart page should leave the cart empty.');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.removeItem('Sauce Labs Backpack');

    await step('Verify cart is empty', async () => {
      await expect(cartPage.cartItems).toHaveCount(0);
    });
  });

  test('should navigate back to inventory from cart', async ({ page }) => {
    await story('Navigation');
    await severity('minor');
    await description(
      'Clicking continue shopping from the cart should return the user to the inventory page.',
    );

    await inventoryPage.goToCart();

    await step('Click continue shopping', async () => {
      await cartPage.continueShoppingButton.click();
    });
    await step('Verify redirect to inventory page', async () => {
      await expect(page).toHaveURL('/inventory.html');
    });
  });
});

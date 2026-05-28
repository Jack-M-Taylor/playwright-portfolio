import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, tag, description, owner, step } from 'allure-js-commons';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../fixtures/users';

test.describe('Product Sorting', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    await epic('E-Commerce Platform');
    await feature('Product Sorting');
    await owner('Jack Taylor');
    await tag('regression');
    await tag('e2e');

    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('should sort products by price low to high', async () => {
    await story('Price sorting');
    await severity('critical');
    await tag('smoke');
    await description(
      'Selecting price low to high should place the cheapest product first and the most expensive last.',
    );

    await inventoryPage.sortBy('lohi');
    await step('Verify cheapest product is first and most expensive is last', async () => {
      const prices = await inventoryPage.getPricesAsNumbers();
      expect(prices[0]).toBe(Math.min(...prices));
      expect(prices[prices.length - 1]).toBe(Math.max(...prices));
    });
  });

  test('should sort products by price high to low', async () => {
    await story('Price sorting');
    await severity('critical');
    await tag('smoke');
    await description(
      'Selecting price high to low should place the most expensive product first and the cheapest last.',
    );

    await inventoryPage.sortBy('hilo');
    await step('Verify most expensive product is first and cheapest is last', async () => {
      const prices = await inventoryPage.getPricesAsNumbers();
      expect(prices[0]).toBe(Math.max(...prices));
      expect(prices[prices.length - 1]).toBe(Math.min(...prices));
    });
  });
});

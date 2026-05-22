import { Page, Locator } from '@playwright/test';
import { allure } from 'allure-playwright';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async removeItem(itemName: string) {
    await allure.step(`Remove "${itemName}" from cart`, async () => {
      const item = this.cartItems.filter({ hasText: itemName });
      await item.locator('[data-test^="remove"]').click();
    });
  }

  async proceedToCheckout() {
    await allure.step('Proceed to checkout', async () => {
      await this.checkoutButton.click();
    });
  }
}

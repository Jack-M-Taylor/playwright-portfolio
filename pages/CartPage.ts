import { Page, Locator } from '@playwright/test';

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
    const item = this.cartItems.filter({ hasText: itemName });
    await item.locator('[data-test^="remove"]').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

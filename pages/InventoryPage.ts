import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly sortDropdown: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async addItemToCart(itemName: string) {
    await step(`Add "${itemName}" to cart`, async () => {
      const item = this.inventoryItems.filter({ hasText: itemName });
      await item.locator('[data-test^="add-to-cart"]').click();
    });
  }

  async removeItemFromCart(itemName: string) {
    await step(`Remove "${itemName}" from cart`, async () => {
      const item = this.inventoryItems.filter({ hasText: itemName });
      await item.locator('[data-test^="remove"]').click();
    });
  }

  async goToCart() {
    await step('Navigate to cart', async () => {
      await this.cartLink.click();
    });
  }

  async logout() {
    await step('Logout', async () => {
      await this.menuButton.click();
      await this.logoutLink.click();
    });
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await step(`Sort products by "${option}"`, async () => {
      await this.sortDropdown.selectOption(option);
    });
  }

  async getPricesAsNumbers(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace('$', '')));
  }
}

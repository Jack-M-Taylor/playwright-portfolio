import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await step('Navigate to login page', async () => {
      await this.page.goto('/');
    });
  }

  async login(username: string, password: string) {
    await step(`Enter username: ${username}`, async () => {
      await this.usernameInput.fill(username);
    });
    await step('Enter password', async () => {
      await this.passwordInput.fill(password);
    });
    await step('Click login button', async () => {
      await this.loginButton.click();
    });
  }
}

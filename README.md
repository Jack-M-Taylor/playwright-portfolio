# Playwright Portfolio — SauceDemo E2E Tests

End-to-end test suite for [SauceDemo](https://www.saucedemo.com) built with [Playwright](https://playwright.dev) and TypeScript, following the Page Object Model pattern.

## Tech Stack

- [Playwright](https://playwright.dev) — browser automation framework
- [TypeScript](https://www.typescriptlang.org) — type safety and better tooling
- GitHub Actions — CI/CD pipeline that runs tests on every push

## Project Structure

```
├── fixtures/
│   └── users.ts          # Test user credentials
├── pages/
│   ├── LoginPage.ts      # Login page interactions
│   ├── InventoryPage.ts  # Product listing page interactions
│   ├── CartPage.ts       # Shopping cart interactions
│   └── CheckoutPage.ts   # Checkout flow interactions
├── tests/
│   ├── auth/
│   │   └── login.spec.ts     # Login / authentication tests
│   └── shopping/
│       ├── cart.spec.ts      # Shopping cart tests
│       └── checkout.spec.ts  # Checkout flow tests
└── playwright.config.ts  # Playwright configuration
```

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies and browsers
npm install
npx playwright install

# Run all tests (headless)
npx playwright test

# Run tests with UI mode (visual, great for debugging)
npx playwright test --ui

# Run a specific test file
npx playwright test tests/auth/login.spec.ts

# Run tests in a specific browser only
npx playwright test --project=chromium

# View the HTML test report
npx playwright show-report
```

## Test Coverage

| Area          | Tests                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------- |
| Login / Auth  | Valid login, locked out user, empty fields, invalid credentials, unauthenticated redirect           |
| Shopping Cart | Add item, add multiple items, remove from inventory, view cart, remove from cart, continue shopping |
| Checkout      | Full happy path, order summary, missing first name, last name, postal code                          |

## Design Patterns

**Page Object Model (POM):** Each page of the app has a corresponding class in `pages/` that encapsulates all selectors and interactions for that page. Tests never reference raw selectors — they call methods on page objects. This makes tests readable and easy to maintain when the UI changes.

**Test data in fixtures:** User credentials and reusable test data live in `fixtures/` instead of being hardcoded in tests.

**`data-test` attributes:** All locators use `[data-test="..."]` attributes rather than CSS classes or text, which is the most resilient selector strategy.

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. The workflow is defined in `.github/workflows/playwright.yml`.

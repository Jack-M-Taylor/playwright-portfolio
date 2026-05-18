# playwright-portfolio — Claude Context

## What this project is
A TypeScript Playwright E2E test suite for [SauceDemo](https://www.saucedemo.com), built as a portfolio project for job interviews. The goal is to demonstrate professional-grade test automation practices.

## How to run tests
```bash
npx playwright test                        # all tests, all browsers
npx playwright test --project=chromium    # chromium only (faster)
npx playwright test --ui                  # visual UI mode
npx playwright test tests/auth/login.spec.ts  # single file
npx playwright show-report                # view HTML report after a run
```

## Project structure
- `pages/` — Page Object Model classes, one per page of the app
- `fixtures/users.ts` — all SauceDemo test user credentials
- `tests/auth/` — login/authentication tests
- `tests/shopping/` — cart and checkout tests
- `playwright.config.ts` — baseURL is `https://www.saucedemo.com`

## Conventions to follow
- All locators use `[data-test="..."]` attributes — never CSS classes or brittle text selectors
- Tests never reference raw selectors — always go through a page object method
- Test data (usernames, passwords) lives in `fixtures/users.ts` and is imported via `USERS.*`
- `beforeEach` handles login and navigation setup so individual tests stay focused on one behaviour
- One assertion per test where possible — each test should have a single clear reason to fail

## SauceDemo test users (all use password: `secret_sauce`)
- `standard_user` — normal working account, use for happy path tests
- `locked_out_user` — cannot log in, use to test locked-out error
- `problem_user` — some UI elements behave incorrectly, use for edge case tests
- `performance_glitch_user` — slow responses, use for timing-related tests
- `error_user` — triggers errors on certain actions
- `visual_user` — visual differences in the UI

## GitHub
- Repo: https://github.com/Jack-M-Taylor/playwright-portfolio
- CI: GitHub Actions runs all tests on every push (see Actions tab)

## About the developer
- Jack is learning Playwright from scratch, coming in with some coding and test automation background
- Building this for job interviews — clarity, professional patterns, and good README matter
- Prefers things explained with the "why", not just the "what"

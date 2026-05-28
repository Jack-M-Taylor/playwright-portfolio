import eslintPluginPlaywright from 'eslint-plugin-playwright';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      playwright: eslintPluginPlaywright,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...eslintPluginPlaywright.configs['flat/recommended'].rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
    },
  },
  prettierConfig,
];

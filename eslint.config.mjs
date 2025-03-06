import base, { createConfig } from '@metamask/eslint-config';
import browser from '@metamask/eslint-config-browser';
import jest from '@metamask/eslint-config-jest';
import nodejs from '@metamask/eslint-config-nodejs';
import typescript from '@metamask/eslint-config-typescript';

const config = createConfig([
  {
    ignores: [
      '**/build/',
      '**/.cache/',
      '**/dist/',
      '**/docs/',
      '**/public/',
      '.yarn/',
    ],
  },

  {
    extends: base,

    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json'],
      },
    },

    settings: {
      'import-x/extensions': ['.js', '.mjs'],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: typescript,

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-shadow': ['error', { allow: ['Text'] }],
    },
  },

  {
    files: ['**/*.js', '**/*.cjs', 'packages/snap/snap.config.ts'],
    extends: nodejs,

    languageOptions: {
      sourceType: 'script',
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js'],
    extends: [jest, nodejs],

    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  {
    files: ['packages/site/src/**'],
    extends: [browser],
  },
]);

export default config;

import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import prettier from 'eslint-config-prettier';
import mochaNoOnly from 'eslint-plugin-mocha-no-only';
import globals from 'globals';
import path from 'path';

export default [
  js.configs.recommended,
  prettier,
  {
    plugins: {
      mochaNoOnly,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
        artifacts: 'readonly',
        contract: 'readonly',
        web3: 'readonly',
        extendEnvironment: 'readonly',
        expect: 'readonly',
      },
    },
    rules: { 'mochaNoOnly/mocha-no-only': ['error'] },
  },
  includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore')),
];

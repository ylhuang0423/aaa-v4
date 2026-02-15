import js from '@eslint/js';
import * as importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import securityPlugin from 'eslint-plugin-security';
import pkg from 'globals';
import tseslint from 'typescript-eslint';

const { browser, node } = pkg;

export default tseslint.config(
  // Global ignores
  {
    ignores: ['node_modules', 'dist', 'out'],
  },

  // Security rules (all files)
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      security: securityPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
      // https://github.com/eslint-community/eslint-plugin-security/issues/21
      'security/detect-object-injection': 'off',
    },
  },

  // Renderer: TypeScript + React (browser context)
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/renderer/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: browser,
      parser: tseslint.parser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      react: reactPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
      'import/no-unused-modules': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./', '../'],
              message: 'Relative imports are not allowed. Use @/* absolute imports instead.',
            },
          ],
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
  },

  // Main + Preload: TypeScript (Node.js context, no React)
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts', 'src/shared/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: node,
      parser: tseslint.parser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/no-duplicates': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
);

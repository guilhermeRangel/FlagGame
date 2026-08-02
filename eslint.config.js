const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

const sourceFiles = ['App.tsx', 'index.ts', 'src/**/*.{ts,tsx}'];

module.exports = [
  {
    ignores: ['.expo/**', 'android/**', 'dist/**', 'ios/**', 'node_modules/**'],
  },
  {
    files: sourceFiles,
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierRecommended.plugins.prettier,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...prettierRecommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['scripts/*.mjs'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierRecommended.plugins.prettier,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierRecommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'warn',
    },
  },
];

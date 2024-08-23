module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended', 
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-refresh', 'react'], 
  settings: {
    react: {
      version: 'detect', 
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-eval': 'error',
    'no-new-func': 'error',
    'no-implied-eval': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    es6: true, // Added to support ES6 environment
    node: true // Added to support Node.js environment
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-eval': 'error', // Added to flag the use of eval()
    'no-new-func': 'error', // Added to flag the use of new Function()
    'no-implied-eval': 'error' // Added to flag the use of setTimeout and setInterval with strings
  },
}
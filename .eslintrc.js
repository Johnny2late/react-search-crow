// eslint-disable-next-line no-undef
module.exports = {
  settings: {
    "react": {
      "version": "detect"
    }
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-react',
    'prettier',
  ],
  rules: {
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
    'no-empty': 0,
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-empty-pattern': 'off',
    'no-case-declarations': 'off',
    'prettier/prettier': 'error',
  },
}

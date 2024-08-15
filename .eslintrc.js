// eslint-disable-next-line no-undef
module.exports = {
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
      rules: {
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              ['^react', '^[^.@]\\w'],
              ['^(@|components)'],
              ['^\\u0000'],
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^\\.\\.(?!/?$)', '^\\.\\./?$'],
              ['^.+\\.?(css)$', '^.+\\.?(sass)$'],
            ],
          },
        ],
      },
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
    'eslint-plugin-simple-import-sort',
    'eslint-plugin-import',
    'eslint-plugin-react',
    'simple-import-sort',
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
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}

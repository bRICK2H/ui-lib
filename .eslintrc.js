module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'consistent-return': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'id-denylist': ['error', 'e', 'err', 'res'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'export' },
    ],
  },
}

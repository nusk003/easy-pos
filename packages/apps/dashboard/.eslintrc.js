module.exports = {
  extends: '@hm/eslint-config/react',
  plugins: ['import'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'packages/apps/cloud-console/tsconfig.json',
      },
    },
    'import/ignore': ['react'],
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],
  },
};

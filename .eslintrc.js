module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-shadow': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': 'off',
        curly: ['error', 'multi'],
        'max-len': [
          'warn',
          {
            code: 150,
          },
        ],
        '@typescript-eslint/quotes': [
          'warn',
          'single',
          {
            avoidEscape: true,
            allowTemplateLiterals: true,
          },
        ],
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};

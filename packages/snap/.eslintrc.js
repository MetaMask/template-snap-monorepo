module.exports = {
  extends: ['../../.eslintrc.js'],

  parserOptions: {
    tsconfigRootDir: __dirname,
  },

  overrides: [
    {
      files: ['snap.config.ts'],
      extends: [
        '@metamask/eslint-config-nodejs',
      ],
    }
  ],

  ignorePatterns: ['!.eslintrc.js', 'dist/'],
};

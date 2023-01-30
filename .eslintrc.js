/** @type {import('@types/eslint').Linter.BaseConfig} */

module.exports = {
  extends: [
    "@lytovka",
    "@lytovka/eslint-config/react",
    "@lytovka/eslint-config/jsx-a11y",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "warn",
    "jsx-a11y/prefer-tag-over-role": "off",
  },
};

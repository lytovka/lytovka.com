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
    "@typescript-eslint/no-throw-literal": "off", // Remix throws objects, such as `Response`, in loaders
  },
};

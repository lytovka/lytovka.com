/** @type {import('@types/eslint').Linter.BaseConfig} */

module.exports = {
  extends: ["@lytovka/eslint-config", "@lytovka/eslint-config/react"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "warn",
  },
};

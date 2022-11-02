/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  parserOptions: {
    sourceType: "module"
  },
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "prettier",
  ],
  plugins: ["simple-import-sort"],
  rules: {
    "no-console": "warn",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
  },
};

/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: ["@lytovka"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "warn",
  },
};

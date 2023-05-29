/** @type {import('@types/eslint').Linter.BaseConfig} */

module.exports = {
  extends: [
    "@lytovka",
    "@lytovka/eslint-config/react",
    "@lytovka/eslint-config/jsx-a11y",
    "@lytovka/eslint-config/import",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  globals: {
    JSX: "readonly",
    SpotifyApi: "readonly",
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-throw-literal": "off", // Remix throws objects, such as `Response`, in loaders,
    "react/hook-use-state": "off",
    "react/jsx-no-constructed-context-values": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
};

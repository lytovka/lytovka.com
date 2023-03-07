const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "var(--color-background)",
      },
      fontSize: {
        "base-10": "62.5%",
      },
      fontFamily: {
        sans: ["JetBrainsMono", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        "8xl": "120rem",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

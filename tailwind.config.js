import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        main: "var(--color-background-light)",
        "main-dark": "var(--color-background-dark)",
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
      gridTemplateColumns: {
        albums: "repeat(5, minmax(300px, 1fr))",
      },
      transitionProperty: {
        height: "height",
        filter: "filter",
      },
      typography: (theme) => {
        // fontSize key returns a tuple of [fontSize, {props}], but we only want the fontSize
        const fontSize = (size) => {
          const res = theme(`fontSize.${size}`);

          return Array.isArray(res) ? res[0] : res;
        };

        return {
          DEFAULT: {
            css: [
              {
                h1: {
                  fontWeight: theme("fontWeight.bold"),
                  fontSize: fontSize("4xl"),
                  marginBottom: theme("spacing.6"),
                  marginTop: 0,
                },
                h2: {
                  fontWeight: theme("fontWeight.bold"),
                  fontSize: fontSize("3xl"),
                  marginBottom: theme("spacing.4"),
                  marginTop: 0,
                },
                h3: {
                  fontWeight: theme("fontWeight.semibold"),
                  fontSize: fontSize("3xl"),
                  marginBottom: theme("spacing.4"),
                  marginTop: 0,
                },
                p: {
                  fontWeight: theme("fontWeight.normal"),
                  fontSize: fontSize("3xl"),
                  marginBottom: theme("spacing.4"),
                  marginTop: 0,
                },
                a: {
                  textDecoration: "underline",
                  textUnderlineOffset: "0.3rem",
                  transitionProperty: "color",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDuration: "150ms",
                },
                strong: {
                  color: "inherit",
                  fontWeight: theme("fontWeight.bold"),
                },
              },
            ],
          },
        };
      },
    },
  },
  plugins: [typography],
};

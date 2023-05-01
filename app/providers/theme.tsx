import type { PropsWithChildren } from "react";
import React from "react";
import { useFetcher } from "@remix-run/react";

const themes = {
  LIGHT: "light",
  DARK: "dark",
} as const;

type Theme = (typeof themes)[keyof typeof themes];

const isTheme = (theme: unknown): theme is Theme => {
  return (
    typeof theme === "string" && Object.values(themes).includes(theme as Theme)
  );
};

const prefersColorSchemeDark = "(prefers-color-scheme: dark)";

const getPreferredTheme = () =>
  window.matchMedia(prefersColorSchemeDark).matches
    ? themes.DARK
    : themes.LIGHT;

type ThemeContextType = [
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>
];

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps extends PropsWithChildren<unknown> {
  specifiedTheme: Theme | null;
}

const ThemeProvider = ({ children, specifiedTheme }: ThemeProviderProps) => {
  const fetcher = useFetcher();
  const [theme, setThemeState] = React.useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (Object.values(themes).includes(specifiedTheme)) {
        return specifiedTheme;
      } else return null;
    }

    if (typeof window !== "object") return null;

    return getPreferredTheme();
  });

  const setTheme = React.useCallback(
    (param: Parameters<typeof setThemeState>[0]) => {
      const newTheme = typeof param === "function" ? param(theme) : param;
      if (newTheme) {
        setThemeState(newTheme);
        fetcher.submit(
          { theme: newTheme },
          { action: "/action/set-theme", method: "POST" }
        );
      }
    },
    [fetcher, theme]
  );

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

/**
 * This script is injected in the `head` section of the pre-compiled HTML document (see `app/root.tsx`).
 *
 * We do this to execute the theme detection logic AFTER the initial HTML is available to the user and BEFORE React rehydrates the application.
 * This way, we can avoid 1) client <> server content mismatch and 2) the "flash of incorrect theme".
 *
 * @see https://www.joshwcomeau.com/react/dark-mode/#crossing-the-chasm-9
 */
const injectThemeScript = `
(function() {
  const theme = window.matchMedia(${JSON.stringify(
    prefersColorSchemeDark
  )}).matches ? "dark" : "light";

  const cl = document.documentElement.classList;

  const themeExists = cl.contains("light") || cl.contains("dark");
  
  if(themeExists){
    console.warn("Server HTML already contains the theme class; hence, this script was not supposed to run. Please let Ivan know you saw this warning (https://github.com/lytovka/lytovka.com/issues).");
  }
  else {
    cl.add(theme);
  }
})()
`;

const ThemeScript = ({ serverTheme }: { serverTheme: Theme | null }) => {
  return serverTheme ? null : (
    <script dangerouslySetInnerHTML={{ __html: injectThemeScript }} />
  );
};

export type { Theme };
export { ThemeProvider, ThemeScript, useTheme, isTheme, themes };

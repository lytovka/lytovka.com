import type { PropsWithChildren } from "react";
import React from "react";
import { useFetcher } from "@remix-run/react";

const themes = {
  LIGHT: "light",
  DARK: "dark",
} as const;

const isTheme = (theme: unknown): theme is Theme => {
  return (
    typeof theme === "string" && Object.values(themes).includes(theme as Theme)
  );
};

const getPreferredTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? themes.DARK
    : themes.LIGHT;

type Theme = (typeof themes)[keyof typeof themes];

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

export type { Theme };
export { ThemeProvider, useTheme, isTheme, themes };

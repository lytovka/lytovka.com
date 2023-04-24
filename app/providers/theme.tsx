import type { PropsWithChildren } from "react";
import React from "react";
import { useFetcher } from "@remix-run/react";

enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

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
      if (Object.values(Theme).includes(specifiedTheme)) {
        return specifiedTheme;
      } else return null;
    }
    
    if (typeof window !== "object") return null;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.DARK
      : Theme.LIGHT;
  });

  const setTheme = React.useCallback(
    (cb: Parameters<typeof setThemeState>[0]) => {
      const newTheme = typeof cb === "function" ? cb(theme) : cb;
      if (newTheme) {
        fetcher.submit(
          { theme: newTheme },
          { action: "/action/set-theme", method: "POST" }
        );
      }
      setThemeState(newTheme);
    },
    [fetcher, theme]
  );

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
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

export { Theme, ThemeProvider, useTheme };

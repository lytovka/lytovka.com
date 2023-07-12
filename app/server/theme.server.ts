import { createCookieSessionStorage } from "@remix-run/node";
import { ONE_YEAR, THEME_SESSION_KEY } from "~/constants";
import type { Theme } from "~/providers/theme";
import { isTheme } from "~/providers/theme";

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "lytovka-com-theme",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    secrets: [process.env.SESSION_SECRET],
  },
});

const getThemeSession = async (request: Request) => {
  const session = await themeSessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  return {
    getTheme: () => {
      const theme = session.get(THEME_SESSION_KEY) as unknown;

      // If the type guard cannot infer the supported theme value (dark or light), we say the ssr theme is undetermined (null).
      return isTheme(theme) ? theme : null;
    },
    hasTheme: () => session.has(THEME_SESSION_KEY),
    setTheme: (theme: Theme) => {
      session.set(THEME_SESSION_KEY, theme);
    },
    commitSession: async () => {
      return themeSessionStorage.commitSession(session, {
        expires: new Date(Date.now() + ONE_YEAR),
      });
    },
  };
};

export { getThemeSession, isTheme };

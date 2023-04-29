import { createCookieSessionStorage } from "@remix-run/node";
import { ONE_YEAR, THEME_SESSION_KEY } from "~/constants";
import type { Theme } from "~/providers/theme";
import { isTheme, themes } from "~/providers/theme";

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
    request.headers.get("Cookie")
  );

  console.log("session", session);

  return {
    getTheme: () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const theme = session.get(THEME_SESSION_KEY);

      return isTheme(theme) ? theme : themes.DARK;
    },
    hasTheme: () => session.has(THEME_SESSION_KEY),
    setTheme: (theme: Theme) => {
      session.set(THEME_SESSION_KEY, theme);
    },
    commitSession: async () => {
      console.log("commitSession", session);

      return themeSessionStorage.commitSession(session, {
        expires: new Date(Date.now() + ONE_YEAR),
      });
    },
  };
};

export { getThemeSession, isTheme };

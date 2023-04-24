import { createCookieSessionStorage } from "@remix-run/node";
import { ONE_YEAR, THEME_SESSION_KEY } from "~/constants";
import { Theme } from "~/providers/theme";

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

const isTheme = (theme: unknown): theme is Theme => {
  return (
    typeof theme === "string" && Object.values(Theme).includes(theme as Theme)
  );
};

const getThemeSession = async (request: Request) => {
  const session = await themeSessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return {
    getTheme: () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const theme = session.get(THEME_SESSION_KEY);
      
      return isTheme(theme) ? theme : Theme.LIGHT;
    },
    hasTheme: () => session.has(THEME_SESSION_KEY),
    setTheme: (theme: Theme) => {
      session.set(THEME_SESSION_KEY, theme);
    },
    commitSession: async () =>
      themeSessionStorage.commitSession(session, {
        expires: new Date(Date.now() + ONE_YEAR),
      }),
  };
};

export { getThemeSession, isTheme };

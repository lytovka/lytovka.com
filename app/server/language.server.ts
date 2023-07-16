import { createCookieSessionStorage } from "@remix-run/node";
import { LANG_SESSION_KEY, ONE_YEAR } from "~/constants";

const languageSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "slyt_lang",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    secrets: [process.env.SESSION_SECRET],
  },
});

export const getLanguageSession = async (request: Request) => {
  const session = await languageSessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  return {
    getLanguage: () => {
      const language = session.get(LANG_SESSION_KEY) as unknown;

      return language;
    },
    hasLanguage: () => session.has(LANG_SESSION_KEY),
    setLanguage: (lang: string) => {
      session.set(LANG_SESSION_KEY, lang);
    },
    commitSession: async () => {
      return languageSessionStorage.commitSession(session, {
        expires: new Date(Date.now() + ONE_YEAR),
      });
    },
  };
};

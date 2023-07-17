import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";
import i18nextOptions from "~/i18nextOptions";
import { createCookie } from "@remix-run/node";

export const i18nCookie = createCookie("i18n", {
  sameSite: "lax",
  path: "/",
});

export default new RemixI18Next({
  detection: {
    cookie: i18nCookie,
    supportedLanguages: i18nextOptions.supportedLngs,
    fallbackLanguage: i18nextOptions.fallbackLng,
  },
  i18next: {
    ...i18nextOptions,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  plugins: [Backend],
});

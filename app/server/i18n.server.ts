import { RemixI18Next } from "remix-i18next";
import i18nextOptions from "~/i18nextOptions";
import { createCookie } from "@remix-run/node";
import en from "~/locales/en.json";
import ru from "~/locales/ru.json";

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
    resources: { en: { translation: en }, ru: { translation: ru } },
  },
});

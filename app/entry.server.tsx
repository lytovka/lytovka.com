import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { config } from "dotenv";
import { renderToString } from "react-dom/server";
import { createInstance } from "i18next";
import i18n from "./server/i18n.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "~/locales/en.json";
import ru from "~/locales/ru.json";

config();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const instance = createInstance();
  const lng = await i18n.getLocale(request);
  const ns = i18n.getRouteNamespaces(remixContext);
  await instance.use(initReactI18next).init({
    supportedLngs: ["en", "ru"],
    fallbackLng: "en",
    react: { useSuspense: false },
    lng,
    ns,
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
  });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file
  const markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>,
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { config } from "dotenv";
import { renderToString } from "react-dom/server";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import i18n from "./server/i18n.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18nextOptions from "~/i18nextOptions";
import { resolve } from "path";

config();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const instance = createInstance();

  // Then we could detect locale from the request
  const lng = await i18n.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  const ns = i18n.getRouteNamespaces(remixContext);
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state.
  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend.init({
    .init({
      ...i18nextOptions, // use the same configuration as in your client side.
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render want to use
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
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

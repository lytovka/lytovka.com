import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  SerializeFrom,
  DataFunctionArgs,
  LinksFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { getEnv } from "~/server/env.server";
import { FourOhFour } from "./components/errors";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import tailwindStyles from "./styles/app.css";
import proseStyles from "./styles/prose.css";
import rootStyles from "./styles/root.css";
import { getHostUrl } from "~/utils/misc";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";
import { getThemeSession } from "./server/theme.server";
import type { Theme } from "./providers/theme";
import { ThemeProvider, ThemeScript, useTheme } from "./providers/theme";
import clsx from "clsx";
import type { AppError } from "~/typings/AppError";
import { PreloadTranslations, useChangeLanguage } from "remix-i18next";
import remixI18n, { i18nCookie } from "./server/i18n.server";
import { useTranslation } from "react-i18next";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const metadataUrl = getMetadataUrl(data?.requestInfo);

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan Lytovka",
      description: "Ivan's homepage.",
      keywords: "ivan lytovka, lytovka, homepage, blog",
      url: metadataUrl,
      image: getSocialImagePreview({
        url: getPreviewUrl(metadataUrl),
        featuredImage: "homepage",
      }),
    }),
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      as: "font",
      href: "/fonts/JetBrainsMono-Regular.ttf",
      type: "font/ttf",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/JetBrainsMono-Bold.ttf",
      type: "font/ttf",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: tailwindStyles,
    },
    {
      rel: "stylesheet",
      href: proseStyles,
    },
    {
      rel: "stylesheet",
      href: rootStyles,
    },
    { rel: "icon", href: "/images/favicon.ico" },
  ];
};

export type RootLoader = typeof loader;
export type RootLoaderData = SerializeFrom<typeof loader>;
export type RootLoaderDataUnwrapped = {
  data: {
    ENV: ReturnType<typeof getEnv>;
    requestInfo: { path: string; origin: string; theme: Theme | null };
    locale: string;
  };
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const themeSession = await getThemeSession(request);
  const locale = await remixI18n.getLocale(request);
  const data = {
    ENV: getEnv(),
    requestInfo: {
      path: new URL(request.url).pathname,
      origin: getHostUrl(request),
      session: {
        theme: themeSession.getTheme(),
      },
    },
    locale,
  };

  return json(data, {
    headers: { "Set-Cookie": await i18nCookie.serialize(locale) },
  });
};

export const handle = {
  i18n: ["common"],
};

function App({ rootLoaderData }: { rootLoaderData: RootLoaderData }) {
  const [theme] = useTheme();
  const { i18n, t } = useTranslation("common");
  const { locale } = useLoaderData<typeof loader>();
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html className={clsx(theme)} dir={i18n.dir()} lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        <PreloadTranslations loadPath="/locales/{{lng}}/{{ns}}.json" />
        <ThemeScript serverTheme={rootLoaderData.requestInfo.session.theme} />
      </head>
      <body className="bg-main dark:bg-main-dark">
        <Navbar t={t("NAVBAR.TITLE")} />
        <Outlet />
        <Footer t={t} />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(rootLoaderData.ENV)};`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<RootLoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.requestInfo.session.theme}>
      <App rootLoaderData={data} />
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as AppError;
  if (error.status === 404) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <Meta />
          <Links />
        </head>
        <body>
          <FourOhFour />
          <Scripts />
        </body>
      </html>
    );
  }
  throw new Error(`Unhandled error: ${error.status}`);
}

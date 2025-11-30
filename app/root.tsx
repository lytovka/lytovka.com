import {
  Links,
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
  MetaFunction,
} from "@remix-run/node";
import { getEnv } from "~/server/env.server.ts";
import { FourOhFour } from "./components/errors.tsx";
import Footer from "./components/footer.tsx";
import Navbar from "./components/navbar.tsx";

import tailwildStyles from "./styles/tailwind.css?url";
import proseStyles from "./styles/prose.css?url";
import rootStyles from "./styles/root.css?url";

import { getHostUrl } from "~/utils/misc.ts";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import { getThemeSession } from "./server/theme.server.ts";
import type { Theme } from "./providers/theme.tsx";
import { ThemeProvider, ThemeScript, useTheme } from "./providers/theme.tsx";
import clsx from "clsx";
import type { AppError } from "~/typings/AppError.ts";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
      href: "/fonts/JetBrainsMono-Regular.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      as: "font",
      href: "/fonts/JetBrainsMono-Bold.woff2",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    { rel: "icon", href: "/images/favicon.ico" },
    { rel: "stylesheet", href: tailwildStyles },
    { rel: "stylesheet", href: proseStyles },
    { rel: "stylesheet", href: rootStyles },
  ];
};

export type RootLoader = typeof loader;
export type RootLoaderData = SerializeFrom<typeof loader>;
export type RootLoaderDataUnwrapped = {
  data: {
    ENV: ReturnType<typeof getEnv>;
    requestInfo: { path: string; origin: string; theme: Theme | null };
  };
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const themeSession = await getThemeSession(request);
  const data = {
    ENV: getEnv(),
    requestInfo: {
      path: new URL(request.url).pathname,
      origin: getHostUrl(request),
      session: {
        theme: themeSession.getTheme(),
      },
    },
  };

  return json(data);
};

function App({ rootLoaderData }: { rootLoaderData: RootLoaderData }) {
  const [theme] = useTheme();

  return (
    <html className={clsx(theme)} lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        <ThemeScript serverTheme={rootLoaderData.requestInfo.session.theme} />
      </head>
      <body className="bg-main dark:bg-main-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(rootLoaderData.ENV)};`,
          }}
        />
        <Scripts />
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
    </html>;
  }
  throw new Error(`Unhandled error: ${error.status}`);
}

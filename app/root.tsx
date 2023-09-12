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
import tailwindStyles from "~/styles/tailwind.css";
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
      <body
        className={clsx("bg-main dark:bg-main-dark min-h-full flex flex-col", {
          "overflow-hidden": false,
        })}
      >
        <Navbar />
        <Outlet />
        <Footer />
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

import {
  json,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import globalStylesUrl from "~/styles/global.css";
import favicon from "~/images/favicon.png";
import featuredImage from "~/images/featured_image.png";
import { getEnv } from "~/utils/env.server";

export const meta: MetaFunction = () => {
  const title = "Ivan's shared documents";
  return {
    viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
    title,
    keywords: "Ivan Lytovka,lytovka.com",
    "og:type": "website",
    "og:image": featuredImage,
    "og:title": title,
    "twitter:card": "summary_large_image",
    "twitter:title": title,
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    { rel: "icon", href: favicon },
  ];
};

type LoaderData = {
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = () => {
  const data: LoaderData = {
    ENV: getEnv(),
  };
  return json(data);
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

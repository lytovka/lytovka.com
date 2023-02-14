import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import favicon from "~/images/favicon.png";
import featuredImage from "~/images/featured_image.png";
import { getEnv } from "~/utils/env.server";
import { FourOhFour } from "./components/errors";

import tailwindStyles from "./styles/app.css";
import proseStyles from "./styles/prose.css";

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
      href: tailwindStyles,
    },
    {
      rel: "stylesheet",
      href: proseStyles,
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
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch()
  if (caught.status === 404) {
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
  }
  throw new Error(`Unhandled error: ${caught.status}`)
} 

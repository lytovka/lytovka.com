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
import { json } from "@remix-run/server-runtime";
import type {
  SerializeFrom,
  DataFunctionArgs,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";
import { getEnv } from "~/utils/env.server";
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const metadataUrl = getMetadataUrl(data.requestInfo);

  return {
    viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
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
  };
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

export type RootLoaderData = SerializeFrom<typeof loader>;

export const loader = ({ request }: DataFunctionArgs) => {
  const data = {
    ENV: getEnv(),
    requestInfo: {
      path: new URL(request.url).pathname,
      origin: getHostUrl(request),
    },
  };

  return json(data);
};

export default function App() {
  const data = useLoaderData<RootLoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <Outlet />
        <Footer />
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
  const caught = useCatch();
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
    </html>;
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

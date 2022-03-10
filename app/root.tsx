import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import globalStylesUrl from "~/styles/global.css";
import favicon from "~/images/favicon.png";

export const meta: MetaFunction = () => {
  return {
    viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
    title: "Ivan's desktop",
    description: "Sharing files with you",
    keywords: "lytovka, lytovka.com",
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

export default function App() {
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
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

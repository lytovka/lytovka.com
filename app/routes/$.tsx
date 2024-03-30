import type { LoaderFunction } from "@vercel/remix";
import { FourOhFour } from "~/components/errors.tsx";

export function loader(): LoaderFunction {
  throw new Response("Not Found", { status: 404 });
}

export default function noop() {}

export function ErrorBoundary() {
  return <FourOhFour />;
}

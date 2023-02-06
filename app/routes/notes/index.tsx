import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getPosts } from "~/utils/posts.server";

export const loader: LoaderFunction = async () => {
    return json(await getPosts());
  };

export default function NotesRoute() {
  return <h1>index notes route</h1>;
}

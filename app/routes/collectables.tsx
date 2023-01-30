import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "remix";
import { json } from "remix";

import { getAlbumsByIds } from "~/server/spotify.server";
export const loader: LoaderFunction = async () => {
  return json(
    await getAlbumsByIds(["3LzKUdUTdJb6P7xGN6SotC", "5Y0p2XCgRRIjna91aQE8q7"])
  );
};

export default function CollectablesPage() {
  const albums = useLoaderData();
  // console.log(albums);
  return (
    <div>
      <h1>{albums.length}</h1>
    </div>
  );
}

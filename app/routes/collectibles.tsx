import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderArgs } from "@remix-run/server-runtime";

import { getAlbumsByIds } from "~/server/spotify.server";

export const loader = async (_: LoaderArgs) => {
  return json(
    await getAlbumsByIds([
      "3LzKUdUTdJb6P7xGN6SotC",
      "2u30gztZTylY4RG7IvfXs8",
      "5Y0p2XCgRRIjna91aQE8q7",
      "0VwJFPilOR47xaCXnJzB4u",
    ])
  );
};

export default function CollectiblesPage() {
  const { albums } = useLoaderData<typeof loader>();
  const images = albums.map((a) => ({ image: a.images[0], altName: a.name }));

  return (
    <div className="px-8 md:max-w-4xl mx-auto prose">
      <h1 className="mb-5">Some text.</h1>
      <div className="grid md:grid-cols-2 gap-6 justify-items-center items-center">
        {images.map((i, index) => (
          <img
            alt={i.altName}
            className=""
            height={300}
            key={index}
            src={i.image.url}
            width={300}
          />
        ))}
      </div>
    </div>
  );
}

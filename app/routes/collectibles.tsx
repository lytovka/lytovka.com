import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderArgs } from "@remix-run/server-runtime";

import { getAlbumsByIds } from "~/server/spotify.server";
import { GoBack } from "~/components/go-back";
import { ExternalLink } from "~/components/external-link";

export const loader = async (_: LoaderArgs) => {
  return json(
    await getAlbumsByIds([
      "3LzKUdUTdJb6P7xGN6SotC",
      "2u30gztZTylY4RG7IvfXs8",
      "5Y0p2XCgRRIjna91aQE8q7",
      "0VwJFPilOR47xaCXnJzB4u",
      "41KpeN0qV6BBsuJgd8tZrE",
      "3539EbNgIdEDGBKkUf4wno",
      "1To7kv722A8SpZF789MZy7",
      "021D07OEcg0c4tUCilc7ah",
      "0u3Rl4KquP15smujFrgGz4",
    ])
  );
};

export default function CollectiblesPage() {
  const { albums } = useLoaderData<typeof loader>();
  const images = albums.map((a) => ({
    image: a.images[0],
    altName: a.name,
    href: a.external_urls.spotify,
  }));

  return (
    <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl">
      <h1 className="font-medium text-4xl mb-2">Collectibles</h1>
      <p className="text-2xl mb-10 italic">
        Records I&apos;ve collected over the years.
      </p>

      <div className="pb-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center items-center">
        {images.map((i, index) => (
          <ExternalLink
            href={i.href}
            key={index}
            rel="noreferrer noopener"
            target="_blank"
          >
            <img
              alt={i.altName}
              className=""
              height={330}
              src={i.image.url}
              width={330}
            />
          </ExternalLink>
        ))}
      </div>
      <GoBack />
    </main>
  );
}

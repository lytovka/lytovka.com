import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderArgs } from "@remix-run/server-runtime";
import collectiblesStylesheet from "~/styles/collectibles.css";

import { getAlbumsByIds } from "~/server/spotify.server";
import GoBack from "~/components/go-back";
import { ExternalLink } from "~/components/external-link";
import type { LinksFunction } from "@remix-run/server-runtime";
import { useDeviceType } from "~/hooks/useDeviceType";

export const loader = async (_: LoaderArgs) => {
  return json(
    await getAlbumsByIds([
      "3LzKUdUTdJb6P7xGN6SotC",
      "2u30gztZTylY4RG7IvfXs8",
      "021D07OEcg0c4tUCilc7ah",
      "41KpeN0qV6BBsuJgd8tZrE",
      "5Y0p2XCgRRIjna91aQE8q7",
      "0VwJFPilOR47xaCXnJzB4u",
      "3539EbNgIdEDGBKkUf4wno",
      "1To7kv722A8SpZF789MZy7",
      "0u3Rl4KquP15smujFrgGz4",
    ])
  );
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: collectiblesStylesheet,
    },
  ];
};

export default function CollectiblesPage() {
  const deviceType = useDeviceType();
  const { albums } = useLoaderData<typeof loader>();
  const images = albums.map((a) => ({
    image: a.images[0],
    altName: a.name,
    href: a.external_urls.spotify,
  }));

  return (
    <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl mb-10">
      <h1 className="font-medium text-4xl mb-2">Collectibles</h1>
      <p className="text-2xl text-stone-300 mb-10 italic">
        Vinyl records I&apos;ve collected over the years.
      </p>

      <div className="pb-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center items-center">
        {images.map((i, index) => (
          <ExternalLink
            className="relative"
            href={i.href}
            key={index}
            rel="noreferrer noopener"
            target="_blank"
          >
            {deviceType === "mobile" ? (
              <span className="flex h-5 w-5 absolute right-3 top-3">
                <span className="ping-class absolute inline-flex h-full w-full rounded-full bg-gray-300" />
                <span className="absolute inline-flex rounded-full h-full w-full bg-gray-300" />
              </span>
            ) : null}
            <img
              alt={i.altName}
              className="h-full w-full hover:opacity-75 transition-opacity md:h-[330px] md:w-[330px]"
              src={i.image.url}
            />
          </ExternalLink>
        ))}
      </div>
      <GoBack />
    </main>
  );
}

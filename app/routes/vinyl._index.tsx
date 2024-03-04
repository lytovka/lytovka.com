import { useLoaderData } from "@remix-run/react";
import "~/styles/vinyl.css";

import { getAlbumsByIds } from "~/server/spotify.server.ts";
import GoBack from "~/components/go-back.tsx";
import { ExternalLink } from "~/components/external-link.tsx";
import { useDeviceType } from "~/hooks/useDeviceType.ts";
import { ServerError } from "~/components/errors.tsx";
import { H1, Paragraph } from "~/components/typography.tsx";
import MainLayout from "~/components/main-layout.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import { json } from "@vercel/remix";
import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import { ONE_MINUTE } from "~/constants/index.ts";

const ALBUMS = [
  {
    name: "Definitely Maybe",
    spotifyId: "3LzKUdUTdJb6P7xGN6SotC",
  },
  {
    name: "WTSMG",
    spotifyId: "2u30gztZTylY4RG7IvfXs8",
  },
  {
    name: "Be Here Now",
    spotifyId: "021D07OEcg0c4tUCilc7ah",
  },
  {
    name: "The Masterplan",
    spotifyId: "15D0D1mafSX8Vx5a7w2ZR4",
  },
  {
    name: "Elwan",
    spotifyId: "41KpeN0qV6BBsuJgd8tZrE",
  },
  {
    name: "The Queen Is Dead",
    spotifyId: "5Y0p2XCgRRIjna91aQE8q7",
  },
  {
    name: "Black Pumas",
    spotifyId: "0VwJFPilOR47xaCXnJzB4u",
  },
  {
    name: "Dummy",
    spotifyId: "3539EbNgIdEDGBKkUf4wno",
  },
  {
    name: "Unplugged In New York",
    spotifyId: "1To7kv722A8SpZF789MZy7",
  },
  {
    name: "Days Gone By",
    spotifyId: "0u3Rl4KquP15smujFrgGz4",
  },
  {
    name: "Screamadelica",
    spotifyId: "4TECsw2dFHZ1ULrT7OA3OL",
  },
];

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan's vinyl collection",
      description: "A collection of vinyl records Ivan owns.",
      keywords: "vinyl, collectibles, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: "vinyl",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "vinyl",
      }),
    }),
  ];
};

export const loader = async (_: LoaderFunctionArgs) => {
  const albums = await getAlbumsByIds(ALBUMS.map((a) => a.spotifyId));
  const images = albums.map((a) => ({
    image: a.images[0],
    altName: a.name,
    href: a.external_urls.spotify,
  }));

  const requestInit = {
    headers: {
      "Cache-Control": `max-age=${ONE_MINUTE}`,
    },
  };

  return json({ albums: images }, requestInit);
};

export default function VinylPage() {
  const deviceType = useDeviceType();
  const { albums } = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <H1 className="mb-2">Vinyl</H1>
      <Paragraph className="mb-10 italic" variant="secondary">
        A small collection of vinyl records I own. Images are clickable.
      </Paragraph>

      <div className="mb-10 flex justify-center flex-wrap flex-row gap-2">
        {albums.map((i, index) => (
          <ExternalLink
            className="relative flex-grow-0 flex-shrink-0 basis-[47%] md:basis-[32%] lg:basis-[24%]"
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
              className="border border-gray-300 dark:border-gray-700 hover:opacity-75 transition-opacity"
              src={i.image.url}
            />
          </ExternalLink>
        ))}
      </div>
      <GoBack />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError title="Could not load albums from Spotify." />;
}

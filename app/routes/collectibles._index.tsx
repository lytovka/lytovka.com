import { useLoaderData } from "@remix-run/react";
import collectiblesStylesheet from "~/styles/collectibles.css";

import { getAlbumsByIds } from "~/server/spotify.server";
import GoBack from "~/components/go-back";
import { ExternalLink } from "~/components/external-link";
import { useDeviceType } from "~/hooks/useDeviceType";
import { ServerError } from "~/components/errors";
import { H1, Paragraph } from "~/components/typography";
import MainLayout from "~/components/main-layout";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";
import { json } from "@vercel/remix";
import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@vercel/remix";
import type { RootLoaderDataUnwrapped } from "~/root";
import { ONE_MINUTE } from "~/constants";

export const meta: V2_MetaFunction<typeof loader> = ({ matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan's collectibles",
      description: "A collection of vinyl records Ivan owns.",
      keywords: "collectibles, vinyl, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: "collectibles",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "collectibles",
      }),
    }),
  ];
};

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
    ]),
    {
      headers: {
        "Cache-Control": `max-age=${ONE_MINUTE}`,
      },
    },
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
    <MainLayout>
      <H1 className="mb-2">Collectibles</H1>
      <Paragraph className="mb-10 italic" variant="secondary">
        Vinyl records I&apos;ve collected over the years. Images are clickable.
      </Paragraph>

      <div className="mb-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center items-center">
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
              className="w-full border border-gray-300 dark:border-gray-700 hover:opacity-75 transition-opacity md:w-[300px]"
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

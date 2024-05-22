import { useLoaderData } from "@remix-run/react";
import "~/styles/vinyl.css";

import { getAlbumsByIds } from "~/server/spotify.server.ts";
import GoBack from "~/components/go-back.tsx";
import { ExternalLink } from "~/components/external-link.tsx";
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
import { prisma } from "~/server/db";

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
  const albumsDb = await prisma.album.findMany({
    select: { spotifyId: true, description: true },
  });
  const albumsSpotify = await getAlbumsByIds(albumsDb.map((a) => a.spotifyId));

  const albumsSplitted = [];

  const chunk = 5;
  for (let i = 0; i < albumsDb.length; i += chunk) {
    const albums = albumsSpotify.slice(i, i + chunk);
    albumsSplitted.push(albums);
  }

  return json({ albumRows: albumsSplitted });
};

export default function VinylPage() {
  const { albumRows } = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <H1 className="mb-2">Vinyl</H1>
      <Paragraph className="mb-10 italic" variant="secondary">
        A small collection of vinyl records I own. Images are clickable.
      </Paragraph>

      <div className="w-full">
        {albumRows.map((albumRow, index) => (
          <div
            className="mb-10 flex flex-row grow overflow-x-scroll relative"
            key={index}
          >
            {albumRow.map((album, i) => (
              <div className="shrink-0 w-[300px] p-3" key={i}>
                <ExternalLink
                  href={album.href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <img
                    alt={album.altName}
                    className="border border-gray-300 dark:border-gray-700 hover:opacity-75 transition-opacity"
                    src={album.image.url}
                  />
                </ExternalLink>
              </div>
            ))}
          </div>
        ))}
      </div>
      <GoBack />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError title="Could not load albums from Spotify." />;
}

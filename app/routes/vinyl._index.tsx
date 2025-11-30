import { Await, useLoaderData } from "@remix-run/react";
import "~/styles/vinyl.css";

import {
  SPOTIFY_COUNT_LIMIT,
  getAlbumsByIds,
} from "~/server/spotify.server.ts";
import GoBack from "~/components/go-back.tsx";
import { ExternalLink } from "~/components/external-link.tsx";
import { ServerError } from "~/components/errors.tsx";
import MainLayout from "~/components/main-layout.tsx";
import { PageHeader } from "~/components/page-header.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import type { MetaFunction } from "@vercel/remix";
import { defer } from "@vercel/remix";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import { prisma } from "~/server/db";
import { Suspense, useRef } from "react";
import { splitIntoChunks } from "~/utils/array";
import { Skeleton } from "~/components/ui/skeleton";
import { useAutoScroll } from "~/hooks/useAutoScroll";

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
      keywords: "vinyl, collectibles, ivan lytovka, lytovka",
      url: metadataUrl,
      description: "A collection of vinyl records Ivan owns.",
      image: getSocialImagePreview({
        title: "vinyl",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "vinyl",
      }),
    }),
  ];
};

export function loader() {
  const albums = prisma.album
    .findMany({
      select: { spotifyId: true, description: true },
    })
    .then((albumsDb) =>
      splitIntoChunks(albumsDb, SPOTIFY_COUNT_LIMIT).map((albumChunk) =>
        getAlbumsByIds(albumChunk.map((a) => a.spotifyId)),
      ),
    )
    .then((all) => Promise.all(all))
    .then((arrays) => arrays.flat())
    .catch((error) => {
      throw new Error(`Could not load albums from Spotify: ${error}`);
    });

  return defer({ albumRows: albums });
}

function VinylSkeleton() {
  return (
    <div className="w-full mb-12">
      {[1, 2].map((_, index) => (
        <div
          className="scroll-container overflow-scroll mb-5 flex flex-row grow gap-2 relative"
          key={index}
        >
          {[1, 2, 3].map((album, i) => (
            <div className="shrink-0 flex items-center px-2" key={i}>
              <div className="inline-flex">
                <figure className="flex flex-col gap-1">
                  <Skeleton className="w-[290px] h-[290px]" />
                  <figcaption className="flex flex-col gap-1 items-center justify-center">
                    <Skeleton className="w-[100px] h-4" />
                    <Skeleton className="w-[100px] h-4" />
                  </figcaption>
                </figure>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function VinylPage() {
  const dataStream = useLoaderData<typeof loader>();
  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);
  useAutoScroll(containerRefs);

  return (
    <MainLayout>
      <PageHeader
        className="mb-10"
        subtitle={
          <span className="italic">
            A small collection of vinyl records I own. Images are clickable.
          </span>
        }
        title="Vinyl"
      />
      <Suspense fallback={<VinylSkeleton />}>
        <Await resolve={dataStream.albumRows}>
          {(data) => {
            const albumChunks = splitIntoChunks(data, 5);

            return (
              <div className="w-full mb-12">
                {albumChunks.map((albumRow, index) => (
                  <div
                    className="scroll-container mb-5 overflow-x-scroll relative flex flex-row"
                    key={index}
                    ref={(ref) => {
                      containerRefs.current[index] = ref;
                    }}
                  >
                    {[...albumRow, ...albumRow].map((album, i) => (
                      <div
                        className="shrink-0 flex items-center w-[300px] px-2"
                        key={`${album.href}-${i}`}
                      >
                        <ExternalLink
                          href={album.href}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          <figure className="flex flex-col gap-1">
                            <img
                              alt={album.altName}
                              className="w-[290px] h-[290px] border border-gray-300 dark:border-gray-700 hover:opacity-75 transition-opacity"
                              src={album.image.url}
                            />
                            <figcaption className="flex flex-col gap-1 items-center justify-center">
                              <span>{album.name}</span>
                              <span className="text-sm">{album.artists}</span>
                            </figcaption>
                          </figure>
                        </ExternalLink>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
      <GoBack />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError title="Could not load albums from Spotify." />;
}

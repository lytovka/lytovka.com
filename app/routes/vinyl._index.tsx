import { Await, useLoaderData } from "@remix-run/react";
import "~/styles/vinyl.css";

import { defer } from "@remix-run/node";
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
import type { MetaFunction } from "@vercel/remix";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import { prisma } from "~/server/db";
import { Suspense, useEffect, useRef } from "react";
import { splitIntoChunks } from "~/utils/array";
import { Skeleton } from "~/components/ui/skeleton";

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

export function loader() {
  const albums = prisma.album
    .findMany({
      select: { spotifyId: true, description: true },
      take: 20,
    })
    .then((albumsDb) => getAlbumsByIds(albumsDb.map((a) => a.spotifyId)));

  return defer({ albumRows: albums } as const);
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

  useEffect(() => {
    const step = 1;
    const delay = 1000 / 60;
    let lastFrameTime = performance.now();

    const autoScroll = (currentTime: number) => {
      if (currentTime - lastFrameTime >= delay) {
        containerRefs.current.forEach((ref, index) => {
          if (!ref) {
            requestAnimationFrame(autoScroll);

            return;
          }
          if (index % 2 === 0) {
            ref.scrollLeft = Math.ceil(ref.scrollLeft + step);
            if (ref.scrollLeft >= ref.scrollWidth / 2) {
              ref.scrollLeft = 0;
            }
          }
          if (index % 2 === 1) {
            ref.scrollLeft -= step;
            if (ref.scrollLeft <= 0) {
              ref.scrollLeft = ref.scrollWidth / 2;
            }
          }
        });
        lastFrameTime = currentTime;
      }

      requestAnimationFrame(autoScroll);
    };

    autoScroll(lastFrameTime);
  }, []);

  return (
    <MainLayout className="px-0 md:px-8">
      <div className="flex flex-col gap-1 mb-10 px-8 md:px-0">
        <H1 className="font-bold">Vinyl</H1>
        <Paragraph className="italic" variant="secondary">
          A small collection of vinyl records I own. Images are clickable.
        </Paragraph>
      </div>

      <Suspense fallback={<VinylSkeleton />}>
        <Await resolve={dataStream.albumRows}>
          {(data) => {
            const albumChunks = splitIntoChunks(data, 5);

            return (
              <div className="w-full mb-12">
                {albumChunks.map((albumRow, index) => (
                  <div
                    className="scroll-container mb-5 flex flex-row grow overflow-x-scroll relative"
                    key={index}
                    ref={(ref) => {
                      containerRefs.current[index] = ref;

                      return ref;
                    }}
                  >
                    {[...albumRow, ...albumRow].map((album, i) => (
                      <div
                        className="shrink-0 flex items-center w-[300px] px-2"
                        key={i}
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
      <GoBack className="px-8 md:px-0" />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError title="Could not load albums from Spotify." />;
}

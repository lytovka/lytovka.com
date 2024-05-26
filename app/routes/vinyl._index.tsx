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
import { isMobile } from "~/utils/user-agent";
import { splitIntoChunks } from "~/utils/array";

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

export async function loader() {
  const albumsDb = await prisma.album.findMany({
    select: { spotifyId: true, description: true },
    take: 20,
  });
  const albumsSpotify = getAlbumsByIds(albumsDb.map((a) => a.spotifyId));

  return defer({ albumRows: albumsSpotify } as const);
}

export default function VinylPage() {
  const dataStream = useLoaderData<typeof loader>();
  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const step = isMobile() ? 1 : 0.5; // step increment starts from 1 on mobile
    const delay = isMobile() ? 0 : 30;
    let lastFrameTime = performance.now();

    const autoScroll = (currentTime: number) => {
      if (currentTime - lastFrameTime >= delay) {
        containerRefs.current.forEach((ref, index) => {
          if (!ref) {
            requestAnimationFrame(autoScroll);

            return;
          }
          if (index % 2 === 0) {
            ref.scrollLeft += step;
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

      <Suspense fallback={<Paragraph>Loading...</Paragraph>}>
        <Await resolve={dataStream.albumRows}>
          {(data) => {
            const albumChunks = splitIntoChunks(data, 5);

            return (
              <div className="w-full">
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
                              className="border border-gray-300 dark:border-gray-700 hover:opacity-75 transition-opacity"
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

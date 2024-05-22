import { useLoaderData } from "@remix-run/react";
import "~/styles/vinyl.css";

import { json } from "@remix-run/node";
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
import { useEffect, useRef } from "react";

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
  const albumsSpotify = await getAlbumsByIds(albumsDb.map((a) => a.spotifyId));

  const albumsSplitted = [];

  const chunk = 5;
  for (let i = 0; i < albumsDb.length; i += chunk) {
    const albums = albumsSpotify.slice(i, i + chunk);
    albumsSplitted.push(albums);
  }

  return json({ albumRows: albumsSplitted } as const, {
    headers: { "Cache-Control": "public, max-age=86000}" },
  });
}

export default function VinylPage() {
  const data = useLoaderData<typeof loader>();
  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const step = 0.5;
    const delay = 20;
    let lastFrameTime = performance.now();

    console.log(containerRefs);
    const autoScroll = (currentTime: number) => {
      if (currentTime - lastFrameTime >= delay) {
        containerRefs.current.forEach((ref) => {
          if (!ref) return;
          ref.scrollLeft += step;
          // Reset scroll amount if end is reached to create an infinite loop
          if (ref.scrollLeft >= ref.scrollWidth - ref.clientWidth) {
            ref.scrollLeft = 0;
          }
        });
        lastFrameTime = currentTime;
      }

      requestAnimationFrame(autoScroll);
    };

    requestAnimationFrame(autoScroll);
  }, []);

  return (
    <MainLayout>
      <H1 className="mb-2">Vinyl</H1>
      <Paragraph className="mb-10 italic" variant="secondary">
        A small collection of vinyl records I own. Images are clickable.
      </Paragraph>

      <div className="w-full">
        {data.albumRows.map((albumRow, index) => (
          <div
            className="scroll-container mb-10 flex flex-row grow overflow-x-scroll relative"
            key={index}
            ref={(ref) => {
              containerRefs.current[index] = ref;

              return ref;
            }}
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

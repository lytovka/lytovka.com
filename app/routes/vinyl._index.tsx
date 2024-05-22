import { useLoaderData } from "@remix-run/react";
import "~/styles/vinyl.css";

import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAlbumsByIds } from "~/server/spotify.server.ts";
import GoBack from "~/components/go-back.tsx";
import { ServerError } from "~/components/errors.tsx";
import { H1, H2, Paragraph } from "~/components/typography.tsx";
import MainLayout from "~/components/main-layout.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  console.log("matches", matches);
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
  const albumsSpotify = await getAlbumsByIds([
    "3LzKUdUTdJb6P7xGN6SotC",
    "2u30gztZTylY4RG7IvfXs8",
    "021D07OEcg0c4tUCilc7ah",
  ]);

  // const albumsSplitted = [];
  //
  // const chunk = 5;
  // for (let i = 0; i < albumsDb.length; i += chunk) {
  //   const albums = albumsSpotify.slice(i, i + chunk);
  //   albumsSplitted.push(albums);
  // }

  return json({ albumRows: albumsSpotify } as const);
}

export default function VinylPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <H1 className="mb-2">Vinyl</H1>
      <Paragraph className="mb-10 italic" variant="secondary">
        A small collection of vinyl records I own. Images are clickable.
      </Paragraph>

      <div className="w-full">
        <H1 className="mb-2">Albums</H1>
        <H2>{data.albumRows.length}</H2>
      </div>
      <GoBack />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError title="Could not load albums from Spotify." />;
}

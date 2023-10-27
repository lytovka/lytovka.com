import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useRouteError } from "@remix-run/react";

import { FourOhFour, ServerError } from "~/components/errors.tsx";
import { getSlugContent } from "~/server/markdown.server.ts";
import { ago, dateFormatter } from "~/utils/date.ts";
import MainLayout from "~/components/main-layout.tsx";
import { H1 } from "~/components/typography.tsx";
import GoBack from "~/components/go-back.tsx";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import type { AppError } from "~/typings/AppError.ts";
import { json } from "@vercel/remix";
import type { LoaderFunctionArgs } from "@vercel/remix";
import { invariantResponse } from "~/utils/misc";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);
  const title = data?.attributes.title;

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title,
      description: "A note.",
      keywords: "note, notes, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title,
        url: getPreviewUrl(metadataUrl),
        featuredImage: "note",
      }),
    }),
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariantResponse(
    params.slug != null,
    "Route parameter $slug was not supplied",
  );
  const note = await getSlugContent(params.slug);
  invariantResponse(note != null, `Note ${params.slug} not found`, {
    status: 404,
  });

  const d = new Date(note.attributes.date);
  const noteExtended = {
    ...note,
    date: dateFormatter.format(d),
  };

  return json(noteExtended);
};

export default function PostSlug() {
  const note = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="flex flex-col gap-1 mb-8">
        <H1>{note.attributes.title}</H1>
        <div className="flex justify-between flex-row">
          <time className="text-lg text-zinc-700 dark:text-zinc-500">
            {note.date} ({ago(new Date(note.attributes.date))})
          </time>
        </div>
      </div>
      <div className="mb-10">
        <article
          className="prose text-3xl"
          dangerouslySetInnerHTML={{ __html: note.body }}
        />
      </div>
      <GoBack />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as AppError;
  if (error.status === 404) {
    return <FourOhFour />;
  }

  return <ServerError title="Could not fetch this post." />;
}

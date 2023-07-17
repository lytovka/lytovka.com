import type { V2_MetaFunction } from "@remix-run/react";
import { useRouteError, useLoaderData } from "@remix-run/react";

import { FourOhFour, ServerError } from "~/components/errors";
import { getSlugContent } from "~/server/markdown.server";
import { ago, dateFormatter } from "~/utils/date";
import MainLayout from "~/components/main-layout";
import { H1 } from "~/components/typography";
import GoBack from "~/components/go-back";
import remixI18n from "~/server/i18n.server";
import type { RootLoaderDataUnwrapped } from "~/root";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";
import type { AppError } from "~/typings/AppError";
import { fetchViewsBySlug, fetchViewsIncrement } from "~/server/redis.server";
import { json } from "@vercel/remix";
import type { LoaderArgs } from "@vercel/remix";

export const meta: V2_MetaFunction<typeof loader> = ({ data, matches }) => {
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

export const loader = async ({ params, request }: LoaderArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined.");
  }
  const locale = await remixI18n.getLocale(request);
  const referer = request.headers.get("referer");
  // If request is from the same origin (e.g during page reloads), we don't increment the views.
  // On page reload, the referer header is `vercel.com` on Vercel platform.
  const increment =
    referer !== "https://vercel.com/" && request.url !== referer;
  const [note, views] = await Promise.all([
    getSlugContent(locale, params.slug),
    increment
      ? fetchViewsIncrement(params.slug)
      : fetchViewsBySlug(params.slug),
  ]);
  if (!note) {
    throw new Response("Note not found.", { status: 404 });
  }

  const d = new Date(note.attributes.date);
  const noteExtended = {
    ...note,
    views,
    date: dateFormatter(locale).format(d),
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
          <span className="text-lg text-zinc-700 dark:text-zinc-500">
            {note.views} views
          </span>
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

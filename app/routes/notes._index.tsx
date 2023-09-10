/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import GoBack from "~/components/go-back.tsx";
import { dateFormatter } from "~/utils/date.ts";
import { fetchPreviews } from "~/server/markdown.server.ts";
import MainLayout from "~/components/main-layout.tsx";
import { H1, Paragraph } from "~/components/typography.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import { ONE_MINUTE } from "~/constants/index.ts";
import type { LoaderArgs } from "@vercel/remix";
import { json } from "@vercel/remix";

export const loader = async (_: LoaderArgs) => {
  const [notes] = await Promise.all([fetchPreviews()]);
  const notesExtended = notes.map((note) => ({
    ...note,
    date: dateFormatter.format(new Date(note.date)),
  }));

  return json(notesExtended, {
    headers: {
      "Cache-Control": `max-age=${ONE_MINUTE}`,
    },
  });
};

export const meta: MetaFunction = ({ matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan's notes",
      description: "Notes on various topics.",
      keywords: "notes, blog, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: "notes",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "notes",
      }),
    }),
  ];
};

export default function NotesRoute() {
  const posts = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <H1 className="mb-2">Notes</H1>
      <Paragraph className="mb-5 italic" variant="secondary">
        My perspective on various topics. All thoughts are my own.
      </Paragraph>
      <ul className="mb-10">
        {posts.map((post, key) => (
          <li
            className="flex flex-col text-2xl pr-3 pt-3 pb-3 md:items-center md:flex-row md:gap-7"
            key={key}
          >
            <span className="text-black dark:text-white opacity-75 text-2xl md:w-60">
              {post.date}
            </span>
            <Link
              className="text-black dark:text-white underline text-2xl hover:opacity-75 hover:transition-opacity"
              to={`/notes/${post.slug}`}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <GoBack />
    </MainLayout>
  );
}

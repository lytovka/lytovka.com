/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import GoBack from "~/components/go-back";
import { dateFormatter } from "~/utils/date";
import { fetchAllContent } from "~/server/markdown.server";
import MainLayout from "~/components/main-layout";
import { H1, Paragraph } from "~/components/typography";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";
import type { RootLoaderDataUnwrapped } from "~/root";
import { fetchAllViews } from "~/server/redis.server";

export const loader = async (_: LoaderArgs) => {
  const [notes, views] = await Promise.all([
    fetchAllContent(),
    fetchAllViews(),
  ]);
  const notesExtended = notes.map((note) => ({
    ...note,
    views: views ? views[note.attributes.slug] : 0,
    date: dateFormatter.format(new Date(note.attributes.date)),
  }));

  return json(notesExtended);
};

export const meta: V2_MetaFunction = ({ matches }) => {
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
            <span className="text-black dark:text-white opacity-75 text-2xl">
              {post.date}
            </span>
            <Link
              className="text-black dark:text-white underline text-2xl hover:opacity-75 hover:transition-opacity"
              to={`/notes/${post.attributes.slug}`}
            >
              {post.attributes.title}
            </Link>
          </li>
        ))}
      </ul>
      <GoBack />
    </MainLayout>
  );
}

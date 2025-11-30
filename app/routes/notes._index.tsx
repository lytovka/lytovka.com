import type { MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import GoBack from "~/components/go-back.tsx";
import { dateFormatter } from "~/utils/date.ts";
import { fetchPreviews } from "~/server/markdown.server.ts";
import MainLayout from "~/components/main-layout.tsx";
import { PageHeader } from "~/components/page-header.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import { ONE_MINUTE } from "~/constants/index.ts";
import { json } from "@vercel/remix";
import type { LoaderFunctionArgs } from "@vercel/remix";

export const loader = async (_: LoaderFunctionArgs) => {
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
      description:
        "Things I find worth writing down. Mostly in English, occasionally in Russian.",
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
      <PageHeader
        className="mb-6"
        subtitle="Things I find worth writing down. Mostly in English, occasionally in Russian."
        title="Notes"
      />
      <ul className="mb-10 space-y-4">
        {posts.map((post, key) => (
          <li
            className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors md:flex-row md:items-center md:gap-7"
            key={key}
          >
            <span className="text-stone-600 dark:text-stone-400 text-lg md:text-xl md:w-80 flex-shrink-0">
              {post.date}
            </span>
            <Link
              className="text-black dark:text-white underline text-xl md:text-2xl hover:opacity-75 hover:transition-opacity"
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

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import GoBack from "~/components/go-back";
import { dateFormatter } from "~/utils/date";
import { fetchPreviews } from "~/server/markdown.server";
import MainLayout from "~/components/main-layout";
import { H1, Paragraph } from "~/components/typography";
import remixI18n from "~/server/i18n.server";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";
import type { RootLoaderDataUnwrapped } from "~/root";
import { fetchAllViews } from "~/server/redis.server";
import { ONE_MINUTE } from "~/constants";
import type { LoaderArgs } from "@vercel/remix";
import { json } from "@vercel/remix";
import { useTranslation } from "react-i18next";

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

export const loader = async ({ request }: LoaderArgs) => {
  const locale = await remixI18n.getLocale(request);
  const [notes, views] = await Promise.all([
    fetchPreviews(locale),
    fetchAllViews(),
  ]);
  const notesExtended = notes.map((note) => ({
    ...note,
    views: views ? views[note.slug] : 0,
    date: dateFormatter(locale).format(new Date(note.date)),
  }));

  return json(notesExtended);
};

export default function NotesRoute() {
  const { t } = useTranslation();
  const posts = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <H1 className="mb-2">{t("NOTES.INDEX.HEADER")}</H1>
      <Paragraph className="mb-5 italic" variant="secondary">
        {t("NOTES.INDEX.SUBHEADER")}
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

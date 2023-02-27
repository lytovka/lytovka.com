import { useCatch, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { MetaFunction, LoaderArgs } from "@remix-run/server-runtime";

import { FourOhFour, ServerError } from "~/components/errors";
import { getSlugContent } from "~/server/markdown.server";
import { dateFormatter } from "~/utils/date";
import MainLayout from "~/components/main-layout";
import { Paragraph } from "~/components/typography";
import GoBack from "~/components/go-back";
import type { RootLoaderData } from "~/root";
import {
  getMetadataUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => {
  const { requestInfo } = parentsData.root as RootLoaderData;
  const metadataUrl = getMetadataUrl(requestInfo);
  const title = data.attributes.title;

  return {
    ...getSocialMetas({
      title,
      description: "A note.",
      keywords: "note, notes, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title,
        url: metadataUrl,
      }),
    }),
  };
};

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined.");
  }
  const res = await getSlugContent(params.slug);
  res.attributes.date = dateFormatter.format(new Date(res.attributes.date));

  return json(res);
};

export default function PostSlug() {
  const note = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="mb-10">
        <Paragraph className="flex mb-3 italic">
          {note.attributes.date}
        </Paragraph>
        <article
          className="prose text-3xl"
          dangerouslySetInnerHTML={{ __html: note.body }}
        />
      </div>
      <GoBack />
    </MainLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return <FourOhFour />;
  }

  return <ServerError title="Could not fetch this post." />;
}

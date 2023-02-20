import { useCatch, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { MetaFunction, LoaderArgs } from "@remix-run/server-runtime";

import { FourOhFour, ServerError } from "~/components/errors";
import type { Note } from "~/server/markdown.server";
import { getSlugContent } from "~/server/markdown.server";
import { dateFormatter } from "~/utils/date";
import MainLayout from "~/components/main-layout";

export const meta: MetaFunction = ({ data }: { data: Note | null }) => {
  if (!data) {
    return {
      title: "No post found",
    };
  }

  return {
    title: `${data.attributes.title}`,
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
      <div>
        <p className="flex text-xl mb-3 italic">{note.attributes.date}</p>
        <article
          className="prose text-3xl"
          dangerouslySetInnerHTML={{ __html: note.body }}
        />
      </div>
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

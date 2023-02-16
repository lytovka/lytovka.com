import { useCatch, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { MetaFunction, LoaderArgs } from "@remix-run/server-runtime";

import type { Post } from "~/typings/Post";
import { FourOhFour, ServerError } from "~/components/errors";
import { getSlugContent } from "~/server/markdown.server";
import { dateFormatter } from "~/utils/date";

type LoaderData = Post;

export const meta: MetaFunction = ({ data }: { data: LoaderData | null }) => {
  if (!data) {
    return {
      title: "No post found",
    };
  }

  return {
    title: `"${data.title}" post`,
  };
};

export const loader = ({ params }: LoaderArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined.");
  }
  const res = getSlugContent(params.slug);
  res.attributes.date = dateFormatter.format(new Date(res.attributes.date));

  return json(res);
};

export default function PostSlug() {
  const note = useLoaderData<typeof loader>();

  return (
    <div className="flex-1">
      <main className="mx-auto px-8 pb-10 sm:max-w-5xl md:max-w-7xl mb-10 relative">
        <div>
          <p className="flex text-xl mb-3 italic">{note.attributes.date}</p>
          <article
            className="prose text-3xl"
            dangerouslySetInnerHTML={{ __html: note.body }}
          />
        </div>
      </main>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return <FourOhFour />;
  }

  return <ServerError title="Could not fetch this post." />;
}

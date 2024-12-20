import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useRouteError } from "@remix-run/react";

import { FourOhFour, ServerError } from "~/components/errors.tsx";
import { getMDXComponent } from "mdx-bundler/client";
import { getMdxSerialize } from "~/server/markdown.server.ts";
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
import { getFileContent } from "~/server/blog.server";
import { useMemo } from "react";

export const meta: MetaFunction<typeof loader> = ({
  params,
  data,
  matches,
}) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  const articleAttributes = {
    title: data?.frontmatter.title ?? params.slug,
    description: data?.frontmatter.description ?? "A note.",
    date: data?.frontmatter.date
      ? new Date(data.frontmatter.date).toISOString()
      : undefined,
  };

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: articleAttributes.title,
      description: articleAttributes.description,
      keywords: "note, notes, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: articleAttributes.title,
        url: getPreviewUrl(metadataUrl),
        featuredImage: "note",
      }),
    }),
    { property: "og:type", content: "article" },
    { property: "article:author", content: "Ivan Lytovka" },
    articleAttributes.date
      ? {
          property: "og:article:published_time",
          content: articleAttributes.date,
        }
      : {},
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariantResponse(params.slug, "Route parameter $slug was not supplied");

  const content = await getFileContent(`markdown/notes/${params.slug}`);
  invariantResponse(content, "Could not fetch the content");

  const code = await getMdxSerialize(content.content);
  const noteExtended = {
    code: code.code,
    frontmatter: {
      ...code.frontmatter,
      prettyDate: dateFormatter.format(new Date(code.frontmatter.date)),
    },
  };

  return json(noteExtended);
};

export default function PostSlug() {
  const { code, frontmatter } = useLoaderData<typeof loader>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-1">
        <H1 className="font-bold">{frontmatter.title}</H1>
        <div className="flex justify-between flex-row">
          <time className="text-lg text-zinc-700 dark:text-zinc-500">
            {frontmatter.prettyDate} ({ago(new Date(frontmatter.date))})
          </time>
        </div>
      </div>
      <div className="my-12">
        <article className="prose text-3xl/[3rem]">
          <Component />
        </article>
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

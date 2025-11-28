import { json } from "@vercel/remix";
import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import GoBack from "~/components/go-back.tsx";
import MainLayout from "~/components/main-layout.tsx";
import ToggleButton from "~/components/toggle-button.tsx";
import type { RootLoaderDataUnwrapped } from "~/root.tsx";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo.ts";
import { GITHUB_LINK } from "~/constants/index.ts";
import { H2 } from "~/components/typography.tsx";
import { getFileContent } from "~/server/blog.server";
import { invariantResponse } from "~/utils/misc";
import { getAboutPageSerialize } from "~/server/markdown.server";

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  return [
    { title: "About | Ivan Lytovka" },
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan's bio",
      description: "Get to know Ivan via this brief introduction.",
      keywords: "about, intro, ivan, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: "about.txt",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "about",
      }),
    }),
  ];
};

export const loader = async (_: LoaderFunctionArgs) => {
  const fileContent = await getFileContent(`markdown/about`, { ext: "md" });
  invariantResponse(fileContent, "File content could not be fetched.");
  const result = await getAboutPageSerialize(fileContent.content);
  invariantResponse(result, "File content could not be fetched.");

  return json(result);
};

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);
  const extendedContentRef = useRef<HTMLDivElement>(null);
  const { short, extended } = useLoaderData<typeof loader>();

  const expandCollapse = (e: ChangeEvent<HTMLInputElement>) => {
    if (!root.current || !extendedContentRef.current) return;
    root.current.style.height = e.target.checked
      ? `${extendedContentRef.current.clientHeight.toString()}px`
      : "0px";
  };

  return (
    <MainLayout>
      <div className="mb-10">
        <a href={GITHUB_LINK} rel="noreferrer noopener" target="_blank">
          <img
            alt="Ivan's avatar"
            className="transition-filter grayscale hover:grayscale-0 rounded-full mx-auto md:float-right md:mr-5 md:mb-5 border-2 border-gray-300 dark:border-gray-700"
            height="160"
            src="/images/ivan_avatar.png"
            width="160"
          />
        </a>
        <div className="flex flex-wrap gap-3 md:gap-5 items-center mt-5 md:mt-0">
          <H2 className="text-2xl md:text-3xl font-extrabold">About</H2>
          <span className="text-zinc-600 dark:text-zinc-500 text-2xl md:text-3xl">
            |
          </span>
          <ToggleButton
            defaultChecked={false}
            title="Long"
            onChange={(e) => {
              expandCollapse(e);
            }}
          />
        </div>
        <article
          className="prose text-xl md:text-3xl mt-7 mb-7"
          dangerouslySetInnerHTML={{ __html: short }}
        />
        <article
          className="transition-height overflow-hidden mb-5"
          ref={root}
          style={{ height: 0 }}
        >
          <div
            className="prose text-xl md:text-3xl"
            dangerouslySetInnerHTML={{ __html: extended }}
            ref={extendedContentRef}
          />
        </article>
      </div>
      <GoBack />
    </MainLayout>
  );
}

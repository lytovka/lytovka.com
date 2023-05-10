import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import GoBack from "~/components/go-back";
import MainLayout from "~/components/main-layout";
import ToggleButton from "~/components/toggle-button";
import type { RootLoaderDataUnwrapped } from "~/root";
import { getIntroFile } from "~/server/markdown.server";
import {
  getMetadataUrl,
  getPreviewUrl,
  getSocialImagePreview,
  getSocialMetas,
} from "~/utils/seo";
import { GITHUB_LINK } from "~/constants";
import { H2 } from "~/components/typography";

export const meta: V2_MetaFunction<typeof loader> = ({ matches }) => {
  const { requestInfo } = (matches[0] as RootLoaderDataUnwrapped).data;
  const metadataUrl = getMetadataUrl(requestInfo);

  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover",
    },
    ...getSocialMetas({
      title: "Ivan's Intro",
      description: "Get to know Ivan via this brief intro.",
      keywords: "intro, ivan, ivan lytovka, lytovka",
      url: metadataUrl,
      image: getSocialImagePreview({
        title: "intro",
        url: getPreviewUrl(metadataUrl),
        featuredImage: "intro",
      }),
    }),
  ];
};

export const loader = async (_: LoaderArgs) => {
  const result = await getIntroFile();

  return json(result);
};

export default function IntroPage() {
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
        <a href={GITHUB_LINK}>
          <img
            alt="Ivan's avatar"
            className="transition-filter grayscale hover:grayscale-0 rounded-full mx-auto md:float-right md:mr-5 md:mb-5"
            height="160"
            src="/images/ivan_avatar.png"
            width="160"
          />
        </a>
        <div className="flex gap-5 items-center mt-5 md:mt-0">
          <H2 className="text-3xl font-extrabold">Intro</H2>
          <span className="text-zinc-600 dark:text-zinc-500 text-3xl">|</span>
          <ToggleButton
            defaultChecked={false}
            title="Long"
            onChange={(e) => {
              expandCollapse(e);
            }}
          />
        </div>
        <article
          className="prose text-3xl mt-7 mb-7"
          dangerouslySetInnerHTML={{ __html: short }}
        />
        <article
          className="transition-height overflow-hidden mb-5"
          ref={root}
          style={{ height: 0 }}
        >
          <div
            className="prose text-3xl"
            dangerouslySetInnerHTML={{ __html: extended }}
            ref={extendedContentRef}
          />
        </article>
      </div>
      <GoBack />
    </MainLayout>
  );
}

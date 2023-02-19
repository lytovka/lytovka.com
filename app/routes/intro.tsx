import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import GoBack from "~/components/go-back";
import MainLayout from "~/components/main-layout";
import ToggleButton from "~/components/toggle-button";
import { getIntroFile } from "~/server/markdown.server";

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
      <div className="mb-3">
        <ToggleButton
          defaultChecked={false}
          title="Full bio"
          onChange={(e) => {
            expandCollapse(e);
          }}
        />
        <div
          className="prose text-3xl mt-3 mb-7"
          dangerouslySetInnerHTML={{ __html: short }}
        />
        <div
          className="transition-height overflow-hidden mb-5"
          ref={root}
          style={{ height: 0 }}
        >
          <div
            className="prose text-3xl"
            dangerouslySetInnerHTML={{ __html: extended }}
            ref={extendedContentRef}
          />
        </div>
      </div>
      <GoBack />
    </MainLayout>
  );
}

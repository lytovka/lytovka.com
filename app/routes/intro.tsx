import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import GoBack from "~/components/go-back"
import ToggleButton from "~/components/toggle-button";
import { getMarkdownFile } from "~/server/getMarkdownFile.server"

export const loader = async (_: LoaderArgs) => {
    const result = await getMarkdownFile()

    return json(result)
}

export default function IntroPage() {
    const root = useRef<HTMLDivElement>(null);
    const extendedContentRef = useRef<HTMLDivElement>(null)
    const { short, extended } = useLoaderData<typeof loader>();

    const expandCollapse = (e: ChangeEvent<HTMLInputElement>) => {
        if (!root.current || !extendedContentRef.current) return;
        root.current.style.height = e.target.checked ? `${extendedContentRef.current.clientHeight.toString()}px` : '0px'
    }

    return (
        <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl mb-10 relative">
            <div className="flex justify-between mb-3">
                <h1 className="font-medium text-4xl mb-2">Introduction</h1>
                <ToggleButton defaultChecked={false} title="Full bio" onChange={(e) => { expandCollapse(e); }} />
            </div>
            <div
                className="prose text-3xl mb-5"
                dangerouslySetInnerHTML={{ __html: short }}
            />
            <div className="transition-height overflow-hidden mb-5" ref={root} style={{ height: 0 }}>
                <div className="prose text-3xl" dangerouslySetInnerHTML={{ __html: extended }} ref={extendedContentRef} />
            </div>
            <GoBack />
        </main>
    )
}
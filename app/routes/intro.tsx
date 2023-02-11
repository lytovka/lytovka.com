import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime";
import { useState } from "react";
import { GoBack } from "~/components/go-back"
import ToggleButton from "~/components/toggle-button";
import { getMarkdownFile } from "~/server/getMarkdownFile.server"

export const loader = async (_: LoaderArgs) => {
    const result = await getMarkdownFile()

    return json(result)
}

export default function IntroPage() {
    const { short, extended } = useLoaderData<typeof loader>();
    const [showExtended, setShowExtended] = useState(false);

    return (
        <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl mb-10 relative">
            <div className="flex justify-between mb-3">
                <h1 className="font-medium text-4xl mb-2">Introduction</h1>
                <ToggleButton title="Full bio" onChange={() => { setShowExtended(prev => !prev) }} />
            </div>
            <div
                className="prose text-3xl mb-8"
                dangerouslySetInnerHTML={{ __html: short }}
            />
            {showExtended ? <div className="prose text-3xl mb-8" dangerouslySetInnerHTML={{ __html: extended }} /> : null}
            <GoBack />
        </main>
    )
}
import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime";
import { useState } from "react";
import { GoBack } from "~/components/go-back"
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
            <div className="absolute right-8">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" value="" onChange={() => { setShowExtended(prev => !prev) }} />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                    <span className="ml-3 text-2xl font-medium text-gray-900 dark:text-gray-300">Full bio</span>
                </label>
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
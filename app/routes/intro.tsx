import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { json } from "react-router"
import { GoBack } from "~/components/go-back"
import { getMarkdownFile } from "~/server/getMarkdownFile.server"

export const loader = async (_: LoaderArgs) => {
    return json(await getMarkdownFile())
}

export default function IntroPage() {
    const bio = useLoaderData<string>();

    return (
        <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl mb-10">
            <div
                className="prose text-3xl mb-8"
                dangerouslySetInnerHTML={{ __html: bio }}
            />
            <GoBack />
        </main>
    )
}
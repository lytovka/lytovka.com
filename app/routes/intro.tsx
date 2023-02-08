import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { json } from "react-router"
import { getMarkdownFile } from "~/server/getMarkdownFile.server"

export const loader = async (_: LoaderArgs) => {
    return json(await getMarkdownFile())
}

export default function IntroPage() {
    const data = useLoaderData();
    console.log(data)

    return (
        <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl">
            <h1>intro</h1>
        </main>
    )
}
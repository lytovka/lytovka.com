import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import GoBack from "~/components/go-back";
import { dateFormatter } from "~/utils/date";
import { getPosts } from "~/utils/posts.server";

export const loader = async (_: LoaderArgs) => {
    const results = await getPosts()
    const newDates = results.map(item => ({ ...item, date: dateFormatter.format(item.date) }))

    return json(newDates);
}

export default function NotesRoute() {
    const posts = useLoaderData<typeof loader>()

    return (
        <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl">
            <table className="table-fixed w-full mb-5">
                <thead>
                    <tr>
                        <th aria-sort="ascending" className="pr-3 pt-3 pb-3 text-2xl text-left text-slate-200">Name</th>
                        <th className="pb-3 text-2xl text-left text-slate-200">Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, key) => (
                        <tr className="text-2xl even:bg-slate-800 pr-3 pt-3 pb-3" key={key}>
                            <td><Link to={post.slug}><p className="text-slate-300 hover:opacity-75 transition-opacity">{post.title}</p></Link></td>
                            <td className="pr-3 pt-3 pb-3 text-slate-300">{post.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <GoBack />
        </main >
    )
}

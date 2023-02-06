import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getPosts } from "~/utils/posts.server";

export const loader: LoaderFunction = async () => {
    return json(await getPosts());
};

export default function NotesRoute() {
    return (
        <main className="mx-auto px-8 py-10 sm:max-w-5xl md:max-w-7xl">
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="pb-3 pl-3 text-2xl text-left text-slate-200">Name</th>
                        <th className="pb-3 pl-3 text-2xl text-left text-slate-200">Size</th>
                        <th className="pb-3 pl-3 text-2xl text-left text-slate-200">Date Added</th>
                    </tr>
                </thead>
                <tbody className="">
                    <tr className="text-2xl">
                        <td className="p-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, soluta?</td>
                        <td className="p-3">10</td>
                        <td className="p-3">10/06/2000</td>
                    </tr>
                    <tr className="text-2xl">
                        <td className="p-3">Lorem ipsum dolor sit amet consectetur adipisicing.</td>
                        <td className="p-3">7</td>
                        <td className="p-3">3</td>
                    </tr>
                    <tr className="text-2xl">
                        <td className="p-3">Lorem ipsum dolor sit amet.</td>
                        <td className="p-3">2</td>
                        <td className="p-3">3</td>
                    </tr>
                </tbody>
            </table>
        </main>
    )
}

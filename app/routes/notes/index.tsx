import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import GoBack from "~/components/go-back";
import { dateFormatter } from "~/utils/date";
import { fetchAllContent } from "~/server/markdown.server";

export const loader = (_: LoaderArgs) => {
  const results = fetchAllContent();
  const newDates = results.map((item) => ({
    ...item,
    date: dateFormatter.format(new Date(item.attributes.date)),
  }));

  return json(newDates);
};

export default function NotesRoute() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div className="flex-1">
      <main className="mx-auto px-8 pb-10 sm:max-w-5xl md:max-w-7xl">
        <ul>
          {posts.map((post, key) => (
            <li key={key}>
              <div className="flex gap-7 text-2xl even:bg-slate-800 pr-3 pt-3 pb-3">
                <span className="text-2xl text-white">{post.date}</span>
                <Link
                  className="text-white text-2xl underline hover:transition-opacity"
                  to={`/notes${post.attributes.slug}`}
                >
                  <p className="text-slate-300 hover:opacity-75 transition-opacity">
                    {post.attributes.title}
                  </p>
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <GoBack />
      </main>
    </div>
  );
}

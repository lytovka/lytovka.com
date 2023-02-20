import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import GoBack from "~/components/go-back";
import { dateFormatter } from "~/utils/date";
import { fetchAllContent } from "~/server/markdown.server";
import MainLayout from "~/components/main-layout";

export const loader = async (_: LoaderArgs) => {
  const results = await fetchAllContent();
  const newDates = results.map((item) => ({
    ...item,
    date: dateFormatter.format(new Date(item.attributes.date)),
  }));

  return json(newDates);
};

export default function NotesRoute() {
  const posts = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <p className="text-2xl text-stone-300 mb-5 italic">
        Notes on various topics. All thoughts are my own.
      </p>
      <ul className="mb-10">
        {posts.map((post, key) => (
          <li
            className="flex flex-col text-2xl pr-3 pt-3 pb-3 md:items-center md:flex-row md:gap-7"
            key={key}
          >
            <span className="text-xl text-white">{post.date}</span>
            <Link
              className="text-white text-3xl underline hover:transition-opacity"
              to={`/notes${post.attributes.slug}`}
            >
              <p className="text-slate-300 hover:opacity-75 transition-opacity">
                {post.attributes.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <GoBack />
    </MainLayout>
  );
}

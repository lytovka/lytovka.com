import type { LinksFunction, LoaderFunction } from "remix";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "remix";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/posts.server";
import type { Post } from "~/types/Post";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: indexStylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async () => {
  return json(await getPosts());
};

export default function Index() {
  const posts = useLoaderData<Array<Post>>();
  return (
    <div className="main-container">
      {posts.map((post) => (
        <Link
          prefetch="intent"
          key={post.slug}
          to={post.slug}
          className="folder-container"
        >
          <img src={folder} aria-label="folder" />
          <p>{post.title}</p>
        </Link>
      ))}
    </div>
  );
}

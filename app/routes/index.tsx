import type { LinksFunction, LoaderFunction } from "remix";
import type { PointerEvent, DragEvent } from "react";
import { useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "remix";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/posts.server";
import type { Post } from "~/types/Post";
import Draggable from "~/components/Draggable";

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
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });

  const handleDragMove = (
    e: PointerEvent<HTMLDivElement> | DragEvent<HTMLDivElement>
  ) => {
    setTranslate({
      x: translate.x + e.pageX,
      y: translate.y + e.pageY,
    });
    console.log({ translate });
  };

  return (
    <div className="main-container">
      {posts.map((post) => (
        <Draggable
          key={post.slug}
          onDragMove={handleDragMove}
        >
          <Link prefetch="intent" to={post.slug} className="folder-container">
            <img src={folder} aria-label="folder" />
            <p>{post.title}</p>
          </Link>
        </Draggable>
      ))}
    </div>
  );
}

import type { LinksFunction, LoaderFunction } from "remix";
import { json } from "remix";
import type { PointerEvent, MouseEvent } from "react";
import { useRef } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/posts.server";
import type { Post } from "~/types/Post";
import { Draggable } from "~/components/Draggable";

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
  const idleTime = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const handleOnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (idleTime.current.end - idleTime.current.start > 200) {
      event.preventDefault();
    }
  };

  const handleOnPointerDown = (event: PointerEvent) => {
    idleTime.current.start = +new Date();
    console.log("link", event.type);
  };

  const handleOnPointerUp = (event: PointerEvent) => {
    idleTime.current.end = +new Date();
    console.log("link", event.type);
  };

  return (
    <div className="main-container">
      {posts.map((post) => (
        <Draggable key={post.slug}>
          <Link
            onPointerDown={handleOnPointerDown}
            onPointerUp={handleOnPointerUp}
            onClick={handleOnClick}
            prefetch="intent"
            to={post.slug}
            className="folder-container"
          >
            <img src={folder} aria-label="folder" />
            <p>{post.title}</p>
          </Link>
        </Draggable>
      ))}
    </div>
  );
}

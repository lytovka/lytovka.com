import type { LinksFunction, LoaderFunction } from "remix";
import { json } from "remix";
import type { PointerEvent, MouseEvent } from "react";
import React, { useRef } from "react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/posts.server";
import type { Post } from "~/types/Post";
import Draggable from "react-draggable";

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
  let navigate = useNavigate();
  const posts = useLoaderData<Array<Post>>();
  const idleTime = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  // const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleOnPointerDown = (event: PointerEvent) => {
    idleTime.current.start = +new Date();
    if (ref.current) {
      ref.current.style.outline = "1px dotted grey";
    }
  };

  const handleOnPointerEndCapture = (event: PointerEvent, slug: string) => {
    idleTime.current.end = +new Date();
    if (idleTime.current.end - idleTime.current.start < 350) {
      navigate(slug);
    }
    if (ref.current) {
      ref.current.style.outline = "";
    }
  };

  const handleOnPointerClick = (event: MouseEvent, slug: string) => {
    if (idleTime.current.end - idleTime.current.start < 350) {
      navigate(slug);
    } else {
      // this prevents unintentional click on achnor element with a mouse device
      event.preventDefault();
    }
    Object.assign(idleTime.current, { end: 0, start: 0 });
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      {posts.map((post) => (
        <Draggable bounds={"parent"} key={post.slug}>
          <div className="w-32 h-auto touch-none" ref={ref}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="flex flex-col items-center no-underline h-full"
              onDragStart={(e) => e.preventDefault()}
              onPointerDown={handleOnPointerDown}
              onPointerUp={(e) => handleOnPointerEndCapture(e, post.slug)}
              onClick={(e) => handleOnPointerClick(e, post.slug)}
            >
              <img
                className="w-30 h-28 decoration-none"
                src={folder}
                aria-label="folder"
              />
              <p className="w-full text-2xl text-center">{post.title}</p>
            </Link>
          </div>
        </Draggable>
      ))}
    </div>
  );
}

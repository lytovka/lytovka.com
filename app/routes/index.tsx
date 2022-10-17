import type { LinksFunction, LoaderFunction } from "remix";
import type { PointerEvent, MouseEvent } from "react";
import type { Post } from "~/types/Post";
import type { DraggableData, DraggableEvent } from "react-draggable";
import type { Coordinates } from "~/typings";
import { json } from "remix";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/posts.server";
import Draggable from "react-draggable";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "~/utils/local-storage";
import { LYT_STORAGE_KEY } from "~/constants/storage-keys";

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
  let navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const idleTime = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [show, setShow] = useState(false);
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 });

  const handleOnPointerDown = (_event: PointerEvent) => {
    idleTime.current.start = +new Date();
    if (ref.current) {
      ref.current.style.outline = "1px dotted grey";
    }
  };

  const handleOnPointerEndCapture = (_event: PointerEvent, slug: string) => {
    idleTime.current.end = +new Date();
    if (idleTime.current.end - idleTime.current.start < 250) {
      navigate(slug);
    }
    if (ref.current) {
      ref.current.style.outline = "";
    }
  };

  const handleOnPointerClick = (event: MouseEvent, slug: string) => {
    if (idleTime.current.end - idleTime.current.start < 250) {
      navigate(slug);
    } else {
      // this prevents unintentional click on anchor element with a mouse device
      event.preventDefault();
    }
    Object.assign(idleTime.current, { end: 0, start: 0 });
  };

  useLayoutEffect(() => {
    const lc = localStorageGetItem(LYT_STORAGE_KEY);
    if (lc !== null) {
      const coords: Coordinates = JSON.parse(lc);
      setDefaultPosition({
        x: Math.min(
          coords.x * document.body.getBoundingClientRect().width,
          document.body.getBoundingClientRect().width - 80
        ),
        y: Math.min(
          coords.y * document.body.getBoundingClientRect().height,
          document.body.getBoundingClientRect().height - 90
        ),
      });
    } else {
      setDefaultPosition({
        x: Math.min(0.5 * (document.body.getBoundingClientRect().width - 80)),
        y: Math.min(0.5 * (document.body.getBoundingClientRect().height - 90)),
      });
    }
    setShow(true);
  }, []);

  useEffect(() => {
    const listener = () => {
      triggerMouseEvent(ref.current, "mouseover");
      triggerMouseEvent(ref.current, "mousedown");
      triggerMouseEvent(ref.current, "mousemove");
      triggerMouseEvent(ref.current, "mouseup");
      triggerMouseEvent(ref.current, "click");
    };

    addEventListener("resize", listener);
    return () => removeEventListener("resize", listener);
  }, []);

  const triggerMouseEvent = (element: any, eventType: string) => {
    const mouseEvent = new Event(eventType, {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(mouseEvent);
  };

  const onStop = (e: DraggableEvent, data: DraggableData) => {
    if (e.isTrusted) {
      const { x, y } = data;
      localStorageSetItem(
        LYT_STORAGE_KEY,
        JSON.stringify({
          x: x / document.body.getBoundingClientRect().width,
          y: y / document.body.getBoundingClientRect().height,
        })
      );
    }
  };

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!e.isTrusted) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      <div className="absolute inset-0 select-none z-10">
        {show &&
          posts.map((post) => (
            <Draggable
              onDrag={onDrag}
              onStop={onStop}
              bounds={"body"}
              key={post.slug}
              defaultPosition={defaultPosition}
            >
              <div className="absolute w-32 h-auto touch-none z-10" ref={ref}>
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
    </div>
  );
}

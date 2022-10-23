import type { LinksFunction, LoaderFunction } from "remix";
import type { PointerEvent } from "react";
import type { Post } from "~/typings/Post";
import type { DraggableData, DraggableEvent } from "react-draggable";
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
import useWindowSize from "~/hooks/useWindowSize";
import type { Position, Positions } from "~/typings/Coordinates";
import { replaceAt } from "~/utils/array";

const LINK_WIDTH_PX = 90;
const LINK_HEIGHT_PX = 90;
const FALLBACK_DEFAULT_POSITIONS: Positions = [
  [0.5, 0.5],
  [0.5, 0.8],
];

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
  const ref = useRef<HTMLDivElement>(null);
  const localStoragePositionsCopy = useRef<Positions>(
    FALLBACK_DEFAULT_POSITIONS
  );
  let navigate = useNavigate();
  const [windowSize] = useWindowSize();
  const [show, setShow] = useState(false);
  const [drag, setDrag] = useState(false);
  const [zIndexes, setZIndexes] = useState<Array<number>>(
    Array(FALLBACK_DEFAULT_POSITIONS.length).fill(0)
  );
  const [defaultPositions, setDefaultPosition] = useState<Positions>([
    [0, 0],
    [0, 0],
  ]);

  const handleOnPointerEndCapture = (_event: PointerEvent, slug: string) => {
    if (drag) {
      return;
    }
    navigate(slug);
  };

  useLayoutEffect(() => {
    if (!windowSize.height || !windowSize.width) {
      return;
    }
    const height = windowSize.height;
    const width = windowSize.width;

    const lc = localStorageGetItem(LYT_STORAGE_KEY);
    if (lc !== null) {
      const positions: Positions = JSON.parse(lc);
      Object.assign(localStoragePositionsCopy.current, positions);
      const transformedPositions: Positions = positions.map((position) => {
        return [
          Math.min(position[0] * width, width - LINK_WIDTH_PX),
          Math.min(position[1] * height, height - LINK_HEIGHT_PX),
        ];
      });
      setDefaultPosition(transformedPositions);
    } else {
      const transformedPositions: Positions = FALLBACK_DEFAULT_POSITIONS.map(
        (position) => {
          return [
            position[0] * (width - LINK_WIDTH_PX),
            position[1] * (height - LINK_HEIGHT_PX),
          ];
        }
      );
      setDefaultPosition(transformedPositions);
    }
    setShow(true);
  }, [windowSize.height, windowSize.width]);

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

  const onStart = (_e: DraggableEvent, data: DraggableData) => {
    const { index } = data.node.dataset;
    if (!index) return;
    setZIndexes((prev) =>
      replaceAt<number>(prev, Number(index), Math.max(...prev) + 1)
    );
  };

  const onDrag = (e: DraggableEvent, data: DraggableData) => {
    setDrag(true);
    if (!e.isTrusted) {
      e.preventDefault();
    }
  };

  const onStop = (e: DraggableEvent, data: DraggableData) => {
    if (!windowSize.height || !windowSize.width) return;
    const { index } = data.node.dataset;
    if (!index) return;
    if (e.isTrusted) {
      const { x, y } = data;
      const newPositions = replaceAt<Position>(
        localStoragePositionsCopy.current,
        Number(index),
        [x / windowSize.width, y / windowSize.height]
      );
      localStorageSetItem(LYT_STORAGE_KEY, JSON.stringify(newPositions));
      Object.assign(localStoragePositionsCopy.current, newPositions);
    }
    setDrag(false);
  };

  return (
    <div className="inline-flex flex-col">
      {show &&
        posts.map((post) => (
          <Draggable
            onStart={onStart}
            onDrag={onDrag}
            onStop={onStop}
            bounds={"body"}
            key={post.slug}
            defaultPosition={{
              x: defaultPositions[0][0],
              y: defaultPositions[0][1],
            }}
          >
            <div
              data-index="0"
              className={`w-36 h-36 touch-none ${
                drag && `pointer-events-none`
              }`}
              style={{ zIndex: zIndexes[0] }}
              ref={ref}
            >
              <Link
                to={post.slug}
                prefetch="intent"
                className="flex flex-col items-center no-underline active:outline-dashed outline-1 outline-gray-500"
                onPointerUp={(e) => handleOnPointerEndCapture(e, post.slug)}
              >
                <img
                  className="w-auto h-28 decoration-none"
                  src={folder}
                  aria-label="folder"
                />
                <p className="text-2xl text-center">{post.title}</p>
              </Link>
            </div>
          </Draggable>
        ))}
    </div>
  );
}

import { useNavigate } from "@remix-run/react";
import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";
import type { LinksFunction } from "@remix-run/server-runtime";

import {
  LYT_STORAGE_KEY,
  LINK_HEIGHT_PX,
  LINK_WIDTH_PX,
  INSTAGRAM_LINK,
  TELEGRAM_LINK,
  GITHUB_LINK,
} from "~/constants";
import useWindowSize from "~/hooks/useWindowSize";
import DOCUMENTS_FOLDER from "~/images/home_folder.png";
import MUSIC_FOLDER from "~/images/folder-teal-music.svg";
import indexStylesUrl from "~/styles/index.css";
import type { Position, Positions } from "~/typings/Coordinates";
import { replaceAt } from "~/utils/array";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "~/utils/local-storage";
import { DraggableItem, HomepageLink } from "~/components/draggable-item";
import { ExternalLink } from "~/components/external-link";

const HOMEPAGE_LINKS: Array<{
  title: string;
  href: string;
  position: Position;
  imgSrc: string;
}> = [
    {
      title: "Notes",
      href: "/notes",
      position: [0.5, 0.5],
      imgSrc: DOCUMENTS_FOLDER,
    },
    {
      title: "Collectibles",
      href: "/collectibles",
      position: [0.15, 0.75],
      imgSrc: MUSIC_FOLDER,
    },
  ];

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: indexStylesUrl,
    },
  ];
};

export default function Index() {
  const draggableElementRefs = useRef<Array<HTMLDivElement>>([]);
  const localStoragePositionsCopy = useRef<Positions>(
    HOMEPAGE_LINKS.map((item) => item.position)
  );
  const navigate = useNavigate();
  const [windowSize] = useWindowSize();
  const [show, setShow] = useState(false);
  const [drag, setDrag] = useState(false);
  const [zIndexes, setZIndexes] = useState<Array<number>>(
    Array(HOMEPAGE_LINKS.length).fill(0)
  );
  const [defaultPositions, setDefaultPositions] = useState<Positions>([
    [0, 0],
    [0, 0],
  ]);

  const handleOnPointerEndCapture = (_event: PointerEvent, slug: string) => {
    if (drag) {
      return;
    }
    navigate(slug);
  };

  useEffect(() => {
    const { height, width } = windowSize;
    if (height === 0 || width === 0) {
      return;
    }

    const lc = localStorageGetItem(LYT_STORAGE_KEY);
    if (lc !== null) {
      const positions = JSON.parse(lc) as Positions;
      Object.assign(localStoragePositionsCopy.current, positions);
      const transformedPositions: Positions = positions.map((position) => {
        return [
          Math.min(position[0] * width, width - LINK_WIDTH_PX),
          Math.min(position[1] * height, height - LINK_HEIGHT_PX),
        ];
      });
      setDefaultPositions(transformedPositions);
    } else {
      const transformedPositions: Positions = HOMEPAGE_LINKS.map(
        ({ position }) => {
          return [
            position[0] * (width - LINK_WIDTH_PX),
            position[1] * (height - LINK_HEIGHT_PX),
          ];
        }
      );
      setDefaultPositions(transformedPositions);
    }
    setShow(true);
  }, [windowSize]);

  useEffect(() => {
    const listener = () => {
      triggerMouseEvent(draggableElementRefs.current, "mouseover");
      triggerMouseEvent(draggableElementRefs.current, "mousedown");
      triggerMouseEvent(draggableElementRefs.current, "mousemove");
      triggerMouseEvent(draggableElementRefs.current, "mouseup");
      triggerMouseEvent(draggableElementRefs.current, "click");
    };
    addEventListener("resize", listener);

    return () => {
      removeEventListener("resize", listener);
    };
  }, []);

  const triggerMouseEvent = (
    elements: Array<HTMLDivElement>,
    eventType: string
  ) => {
    const mouseEvent = new Event(eventType, {
      bubbles: true,
      cancelable: true,
    });
    for (const element of elements) {
      element.dispatchEvent(mouseEvent);
    }
  };

  const onStart = (_e: DraggableEvent, data: DraggableData) => {
    const { index } = data.node.dataset;
    if (!index) return;
    setZIndexes((prev) =>
      replaceAt<number>(prev, Number(index), Math.max(...prev) + 1)
    );
  };

  const onDrag = (e: DraggableEvent, _data: DraggableData) => {
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
    <>
      <nav className="flex justify-center fixed top-10 right-5 left-5 z-30">
        <h1 className="text-2xl text-zinc-200">Ivan&apos;s docs</h1>
      </nav>
      <main className="inline-flex flex-col z-10">
        {show
          ? HOMEPAGE_LINKS.map((item, key) => (
            <DraggableItem
              defaultPosition={defaultPositions[key]}
              key={key}
              onDrag={onDrag}
              onStart={onStart}
              onStop={onStop}
            >
              <HomepageLink
                data-index={key}
                href={item.href}
                imgSrc={item.imgSrc}
                isDraggable={drag}
                ref={(el) => el && draggableElementRefs.current[key]}
                style={{ zIndex: zIndexes[key] }}
                title={item.title}
                onPointerUp={(e) => {
                  handleOnPointerEndCapture(e, item.href);
                }}
              />
            </DraggableItem>
          ))
          : null}
      </main>
      <footer className="fixed bottom-10 left-5 right-5 flex justify-center gap-4 z-30">
        <ExternalLink
          className="text-zinc-200"
          href={GITHUB_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </ExternalLink>
        <span className="text-white">/</span>
        <ExternalLink
          className="text-zinc-200"
          href={INSTAGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Instagram
        </ExternalLink>
        <span className="text-white">/</span>
        <ExternalLink
          className="text-zinc-200"
          href={TELEGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"

        >
          Telegram
        </ExternalLink>
      </footer>
    </>
  );
}

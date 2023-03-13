import { useNavigate } from "@remix-run/react";
import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";

import { LYT_STORAGE_KEY, LINK_HEIGHT_PX, LINK_WIDTH_PX } from "~/constants";
import useWindowSize from "~/hooks/useWindowSize";
import type { Position, Positions } from "~/typings/Coordinates";
import { replaceAt } from "~/utils/array";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "~/utils/local-storage";
import { DraggableItem, HomepageLink } from "~/components/draggable-item";
import MainLayout from "~/components/main-layout";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";

const HOMEPAGE_LINKS: Array<{
  title: string;
  href: string;
  position: Position;
  imgSrc: string;
}> = [
  {
    title: "notes",
    href: "/notes",
    position: [0.55, 0.15],
    imgSrc: "/images/folder-documents.svg",
  },
  {
    title: "collectibles",
    href: "/collectibles",
    position: [0.25, 0.2],
    imgSrc: "/images/folder-music.svg",
  },
  {
    title: "intro.txt",
    href: "/intro",
    position: [0.5, 0.35],
    imgSrc: "/images/file-text.svg",
  },
];

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      as: "image",
      href: "/images/folder-documents.svg",
      type: "image/svg+xml",
    },
    {
      rel: "preload",
      as: "image",
      href: "/images/folder-music.svg",
      type: "image/svg+xml",
    },
    {
      rel: "preload",
      as: "image",
      href: "/images/file-text.svg",
      type: "image/svg+xml",
    },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const draggableElementRefs = useRef<Array<HTMLDivElement>>([]);
  const localStoragePositionsCopy = useRef<Positions>(
    HOMEPAGE_LINKS.map((item) => item.position)
  );
  const [windowSize] = useWindowSize();
  const [show, setShow] = useState(false);
  const [drag, setDrag] = useState(false);
  const [zIndexes, setZIndexes] = useState<Array<number>>(
    Array(HOMEPAGE_LINKS.length).fill(0)
  );
  const [defaultPositions, setDefaultPositions] = useState<Positions>(
    Array(HOMEPAGE_LINKS.length).fill([0, 0])
  );

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
    <MainLayout homepage>
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
    </MainLayout>
  );
}

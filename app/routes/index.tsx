import { useNavigate } from "@remix-run/react";
import type { PointerEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";
import type { LinksFunction } from "@remix-run/server-runtime";

import { LYT_STORAGE_KEY } from "~/constants/storage-keys";
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

const LINK_WIDTH_PX = 90;
const LINK_HEIGHT_PX = 90;
const FALLBACK_DEFAULT_POSITIONS: Positions = [
  [0.5, 0.5],
  [0.15, 0.75],
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
    FALLBACK_DEFAULT_POSITIONS
  );
  const navigate = useNavigate();
  const [windowSize] = useWindowSize();
  const [show, setShow] = useState(false);
  const [drag, setDrag] = useState(false);
  const [zIndexes, setZIndexes] = useState<Array<number>>(
    Array(FALLBACK_DEFAULT_POSITIONS.length).fill(0)
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
    if (!windowSize.height || !windowSize.width) {
      return;
    }
    const height = windowSize.height;
    const width = windowSize.width;

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
      const transformedPositions: Positions = FALLBACK_DEFAULT_POSITIONS.map(
        (position) => {
          return [
            position[0] * (width - LINK_WIDTH_PX),
            position[1] * (height - LINK_HEIGHT_PX),
          ];
        }
      );
      setDefaultPositions(transformedPositions);
    }
    setShow(true);
  }, [windowSize.height, windowSize.width]);

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
    <div className="inline-flex flex-col">
      {show ? (
        <React.Fragment>
          <DraggableItem
            defaultPosition={defaultPositions[0]}
            onDrag={onDrag}
            onStart={onStart}
            onStop={onStop}
          >
            <HomepageLink
              data-index="0"
              href="/notes"
              imgSrc={DOCUMENTS_FOLDER}
              isDraggable={drag}
              ref={(el) => el && draggableElementRefs.current[0]}
              style={{ zIndex: zIndexes[0] }}
              title="Notes"
              onPointerUp={(e) => {
                handleOnPointerEndCapture(e, "/notes");
              }}
            />
          </DraggableItem>
          <DraggableItem
            defaultPosition={defaultPositions[1]}
            onDrag={onDrag}
            onStart={onStart}
            onStop={onStop}
          >
            <HomepageLink
              data-index="1"
              href="/collectibles"
              imgSrc={MUSIC_FOLDER}
              isDraggable={drag}
              ref={(el) => el && draggableElementRefs.current[1]}
              style={{ zIndex: zIndexes[1] }}
              title="Collectibles"
              onPointerUp={(e) => {
                handleOnPointerEndCapture(e, "/collectibles");
              }}
            />
          </DraggableItem>
        </React.Fragment>
      ) : null}
    </div>
  );
}

import { Link } from "@remix-run/react";
import type { PropsWithChildren, ReactNode } from "react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileTextIcon,
  FolderDocumentsIcon,
  FolderMusicIcon,
} from "~/components/icons";
import { DraggingContext, MovableComponent } from "~/components/movable.tsx";
import { Paragraph } from "~/components/typography.tsx";
import { LYT_STORAGE_KEY } from "~/constants/index.ts";
import type { Position, Positions } from "~/typings/Coordinates.ts";
import { replaceAt } from "~/utils/array.ts";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "~/utils/local-storage.ts";

const HOMEPAGE_LINKS: Array<{
  title: string;
  href: string;
  position: Position;
  imgSrc: ReactNode;
}> = [
  {
    title: "notes",
    href: "/notes",
    position: [55, 15],
    imgSrc: <FolderDocumentsIcon />,
  },
  {
    title: "collectibles",
    href: "/collectibles",
    position: [25, 20],
    imgSrc: <FolderMusicIcon />,
  },
  {
    title: "intro.txt",
    href: "/intro",
    position: [50, 35],
    imgSrc: <FileTextIcon />,
  },
];

export const DraggingProvider = ({ children }: PropsWithChildren) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  return (
    <DraggingContext.Provider value={{ draggingItem, setDraggingItem }}>
      {children}
    </DraggingContext.Provider>
  );
};

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [defaultPositions, setDefaultPositions] = useState<Positions>(
    Array(HOMEPAGE_LINKS.length).fill([0, 0]),
  );
  const [zIndexes, setZIndexes] = useState<Array<number>>(
    Array(HOMEPAGE_LINKS.length).fill(0),
  );
  const localStoragePositionsCopy = useRef<Positions>(
    HOMEPAGE_LINKS.map((item) => item.position),
  );

  useEffect(() => {
    const positions: Positions = HOMEPAGE_LINKS.map((item) => item.position);
    const lcPositions = localStorageGetItem(LYT_STORAGE_KEY);
    if (lcPositions === null) {
      setDefaultPositions(positions);
      setShow(true);

      return;
    }
    const parsedPositions = JSON.parse(lcPositions) as Positions;
    Object.assign(localStoragePositionsCopy.current, parsedPositions);
    setDefaultPositions(parsedPositions);

    setShow(true);
  }, []);

  const savePositions = useCallback(
    (index: number, { x, y }: { x: number; y: number }) => {
      const positions = localStoragePositionsCopy.current;
      localStorage.setItem(LYT_STORAGE_KEY, JSON.stringify(positions));
      const newPositions = replaceAt<Position>(
        localStoragePositionsCopy.current,
        index,
        [x, y],
      );
      localStorageSetItem(LYT_STORAGE_KEY, JSON.stringify(newPositions));
      Object.assign(localStoragePositionsCopy.current, newPositions);
    },
    [],
  );

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent,
    index: string,
  ) => {
    setHasMoved(false);
    setZIndexes((prev) =>
      replaceAt<number>(prev, Number(index), Math.max(...prev) + 1),
    );
  };

  const handleMouseMove = () => {
    setHasMoved(true);
  };

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (hasMoved) {
      event.preventDefault();
      setHasMoved(false);
    }
  };

  return (
    <main className="h-full w-full" ref={containerRef}>
      <DraggingProvider>
        {show
          ? HOMEPAGE_LINKS.map((item, index) => (
              <MovableComponent
                callback={savePositions}
                containerRef={containerRef}
                id={`${index}`}
                initialPosition={defaultPositions[index]}
                key={index}
                style={{ zIndex: zIndexes[index] }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                <Link
                  className="flex flex-col items-center no-underline active:outline-dashed outline-1 outline-gray-500 }"
                  draggable={false}
                  prefetch="intent"
                  to={item.href}
                  onClick={(e) => {
                    handleLinkClick(e);
                  }}
                >
                  {item.imgSrc}
                  <Paragraph className="text-center">{item.title}</Paragraph>
                </Link>
              </MovableComponent>
            ))
          : null}
      </DraggingProvider>
    </main>
  );
}

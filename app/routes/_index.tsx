import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import "~/styles/index.css";
import {
  FileTextIcon,
  FolderDocumentsIcon,
  FolderMusicIcon,
} from "~/components/icons";
import { DraggableComponent } from "@lytovka/draggable";
import type {
  DraggableItemStats,
  Position,
  Positions,
} from "@lytovka/draggable";
import { Paragraph } from "~/components/typography";
import { LYT_STORAGE_KEY } from "~/constants";
import { replaceAt } from "~/utils/array";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "~/utils/local-storage";

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
    title: "vinyl",
    href: "/vinyl",
    position: [25, 20],
    imgSrc: <FolderMusicIcon />,
  },
  {
    title: "about.txt",
    href: "/about",
    position: [50, 35],
    imgSrc: <FileTextIcon />,
  },
];

const initialPositions = Array(HOMEPAGE_LINKS.length).fill([0, 0]);

export default function IndexPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [defaultPositions, setDefaultPositions] =
    useState<Positions>(initialPositions);
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

  const savePositions = useCallback((id: string, stats: DraggableItemStats) => {
    const positions = localStoragePositionsCopy.current;
    localStorage.setItem(LYT_STORAGE_KEY, JSON.stringify(positions));
    const newPositions = replaceAt<Position>(
      localStoragePositionsCopy.current,
      parseInt(id, 10),
      stats.positionPercent,
    );
    localStorageSetItem(LYT_STORAGE_KEY, JSON.stringify(newPositions));
    Object.assign(localStoragePositionsCopy.current, newPositions);
  }, []);

  const handleMouseDown = (
    _: React.MouseEvent<Element, MouseEvent> | React.TouchEvent,
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
    <main className="h-full w-full relative" ref={containerRef}>
      {show
        ? HOMEPAGE_LINKS.map((item, index) => (
            <DraggableComponent
              callback={savePositions}
              containerRef={containerRef}
              id={`${index}`}
              initialPosition={defaultPositions[index]}
              key={index}
              style={{ zIndex: zIndexes[index] }}
              onDragMove={handleMouseMove}
              onDragStart={handleMouseDown}
            >
              <Link
                className="flex flex-col items-center no-underline active:outline-dashed outline-1 outline-gray-500"
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
            </DraggableComponent>
          ))
        : null}
    </main>
  );
}

import { Link } from "@remix-run/react";
import type { MutableRefObject, PropsWithChildren, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileTextIcon,
  FolderDocumentsIcon,
  FolderMusicIcon,
} from "~/components/icons";
import { DraggingContext, MovableComponent } from "~/components/movable";
import { Paragraph } from "~/components/typography";
import { LYT_STORAGE_KEY } from "~/constants";
import type { Position, Positions } from "~/typings/Coordinates";
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

interface DraggingProviderProps extends PropsWithChildren {
  localStoragePositionsCopy: MutableRefObject<Positions>;
}

export const DraggingProvider = ({
  children,
  localStoragePositionsCopy,
}: DraggingProviderProps) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  return (
    <DraggingContext.Provider
      value={{
        draggingItem,
        setDraggingItem,
        state: { localStoragePositionsCopy },
      }}
    >
      {children}
    </DraggingContext.Provider>
  );
};

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [defaultPositions, setDefaultPositions] = useState<Positions>(
    Array(HOMEPAGE_LINKS.length).fill([0, 0])
  );
  const localStoragePositionsCopy = useRef<Positions>(
    HOMEPAGE_LINKS.map((item) => item.position)
  );

  useEffect(() => {
    const transformedPositions: Positions = HOMEPAGE_LINKS.map(
      ({ position }) => {
        return [position[0], position[1]];
      }
    );
    const lc = localStorageGetItem(LYT_STORAGE_KEY);
    if (lc === null) {
      setDefaultPositions(transformedPositions);
      setShow(true);

      return;
    }
    const positions = JSON.parse(lc) as Positions;
    Object.assign(localStoragePositionsCopy.current, positions);
    setDefaultPositions(positions);

    setShow(true);
  }, []);

  const savePositions = useCallback(
    (index: number, { x, y }: { x: number; y: number }) => {
      const positions = localStoragePositionsCopy.current;
      localStorage.setItem(LYT_STORAGE_KEY, JSON.stringify(positions));
      const newPositions = replaceAt<Position>(
        localStoragePositionsCopy.current,
        index,
        [x, y]
      );
      localStorageSetItem(LYT_STORAGE_KEY, JSON.stringify(newPositions));
      Object.assign(localStoragePositionsCopy.current, newPositions);
    },
    []
  );

  return (
    <main className="h-full w-full" ref={containerRef}>
      <DraggingProvider localStoragePositionsCopy={localStoragePositionsCopy}>
        {show
          ? HOMEPAGE_LINKS.map((item, index) => (
              <MovableComponent
                callback={savePositions}
                containerRef={containerRef}
                id={`${index}`}
                initialPosition={defaultPositions[index]}
                key={index}
              >
                <Link
                  className="flex flex-col items-center no-underline active:outline-dashed outline-1 outline-gray-500"
                  prefetch="intent"
                  to={item.href}
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
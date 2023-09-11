import type { Dispatch, MutableRefObject, PropsWithChildren } from "react";
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { LINK_WIDTH_PX } from "~/constants";
import type { Position, Positions } from "~/typings/Coordinates";

interface DraggingContextType {
  state: {
    localStoragePositionsCopy: MutableRefObject<Positions> | null;
  };
  draggingItem: string | null;
  setDraggingItem: Dispatch<React.SetStateAction<string | null>>;
}

export const DraggingContext = React.createContext<DraggingContextType>({
  draggingItem: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDraggingItem: () => {},
  state: {
    localStoragePositionsCopy: null,
  },
});

interface DragData {
  originalX: number;
  originalY: number;
  startX: number;
  startY: number;
  containerWidth: number;
  containerHeight: number;
}

export const useDragging = () => {
  return useContext(DraggingContext);
};

interface Props {
  id: string;
  initialPosition: Position;
  containerRef: React.RefObject<HTMLDivElement> | null;
  callback: (id: number, { x, y }: { x: number; y: number }) => void;
}

export const MovableComponent = ({
  id,
  containerRef,
  initialPosition,
  callback,
  children,
}: PropsWithChildren<Props>) => {
  const [position, setPosition] = useState({
    x: initialPosition[0] || 0,
    y: initialPosition[1] || 0,
  });
  const dragData = useRef<DragData>({
    originalX: 0,
    originalY: 0,
    startX: 0,
    startY: 0,
    containerHeight: 0,
    containerWidth: 0,
  });
  const { draggingItem, setDraggingItem } = useDragging();

  const updateContainerDimensions = useCallback(() => {
    if (containerRef?.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      dragData.current.containerWidth = width;
      dragData.current.containerHeight = height;
    }
  }, [containerRef]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // Call initially to set the dimensions
    updateContainerDimensions();

    if (containerRef?.current) {
      const resizeObserver = new ResizeObserver(() => {
        updateContainerDimensions();
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerRef, updateContainerDimensions]);

  const handleMouseMove = useCallback(
    (event: { clientX: number; clientY: number }) => {
      if (draggingItem === id) {
        const deltaX = event.clientX - dragData.current.originalX;
        const deltaY = event.clientY - dragData.current.originalY;
        const percentX = (deltaX / dragData.current.containerWidth) * 100;
        const percentY = (deltaY / dragData.current.containerHeight) * 100;

        // Calculate object width and height in percentage
        const objectWidthInPercentage =
          (LINK_WIDTH_PX / dragData.current.containerWidth) * 100;
        const objectHeightInPercentage =
          (LINK_WIDTH_PX / dragData.current.containerHeight) * 100;

        // Calculate max allowed percentage
        const maxPercentX = 100 - objectWidthInPercentage;
        const maxPercentY = 100 - objectHeightInPercentage;

        // Clamp the values between the minimum and maximum
        const finalX = Math.min(
          Math.max(0, dragData.current.startX + percentX),
          maxPercentX
        );
        const finalY = Math.min(
          Math.max(0, dragData.current.startY + percentY),
          maxPercentY
        );

        setPosition({
          x: finalX,
          y: finalY,
        });
      }
    },
    [draggingItem, id]
  );

  const stopDragging = useCallback(() => {
    if (draggingItem === id) {
      setDraggingItem(null);
      callback(Number(id), {
        x: position.x,
        y: position.y,
      });
    }
  }, [draggingItem, id, setDraggingItem, callback, position]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!draggingItem) {
        setDraggingItem(id);
        dragData.current = {
          ...dragData.current,
          originalX: event.clientX,
          originalY: event.clientY,
          startX: position.x,
          startY: position.y,
        };
      }
    },
    [draggingItem, id, position.x, position.y, setDraggingItem]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!draggingItem) {
        setDraggingItem(id);
        dragData.current = {
          ...dragData.current,
          originalX: event.touches[0].clientX,
          originalY: event.touches[0].clientY,
          startX: position.x,
          startY: position.y,
        };
      }
    },
    [draggingItem, id, position.x, position.y, setDraggingItem]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (draggingItem === id) {
        const deltaX = event.touches[0].clientX - dragData.current.originalX;
        const deltaY = event.touches[0].clientY - dragData.current.originalY;
        const percentX = (deltaX / dragData.current.containerWidth) * 100;
        const percentY = (deltaY / dragData.current.containerHeight) * 100;

        // Calculate object width and height in percentage
        const objectWidthInPercentage =
          (LINK_WIDTH_PX / dragData.current.containerWidth) * 100;
        const objectHeightInPercentage =
          (LINK_WIDTH_PX / dragData.current.containerHeight) * 100;

        // Calculate max allowed percentage
        const maxPercentX = 100 - objectWidthInPercentage;
        const maxPercentY = 100 - objectHeightInPercentage;

        // Clamp the values between the minimum and maximum
        const finalX = Math.min(
          Math.max(0, dragData.current.startX + percentX),
          maxPercentX
        );
        const finalY = Math.min(
          Math.max(0, dragData.current.startY + percentY),
          maxPercentY
        );

        setPosition({
          x: finalX,
          y: finalY,
        });
      }
    },
    [draggingItem, id]
  );

  // Add event listeners
  useEffect(() => {
    if (draggingItem === id) {
      // Mouse events
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDragging);

      // Touch events
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", stopDragging);
    }

    return () => {
      // Mouse events
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);

      // Touch events
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [draggingItem, handleMouseMove, handleTouchMove, id, stopDragging]);

  return (
    <div
      className="absolute z-1 w-[90px] h-[90px]"
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
};

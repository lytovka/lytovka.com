import type { Dispatch, HTMLAttributes, PropsWithChildren } from "react";
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { LINK_HEIGHT_PX, LINK_WIDTH_PX } from "~/constants";
import type { Position } from "~/typings/Coordinates";

interface DraggingContextType {
  draggingItem: string | null;
  setDraggingItem: Dispatch<React.SetStateAction<string | null>>;
}

export const DraggingContext = React.createContext<DraggingContextType>({
  draggingItem: null,
  setDraggingItem: () => {},
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

interface Props
  extends PropsWithChildren,
    Omit<HTMLAttributes<HTMLElement>, "onMouseDown" | "onMouseMove"> {
  id: string;
  initialPosition: Position;
  containerRef: React.RefObject<HTMLDivElement> | null;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>, id: string) => void;
  onMouseMove: (event: MouseEvent, id: string) => void;
  callback: (id: number, { x, y }: { x: number; y: number }) => void;
}

export const MovableComponent = ({
  id,
  containerRef,
  initialPosition,
  children,
  callback,
  onMouseDown,
  onMouseMove,
  ...rest
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

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setDraggingItem(id);
      dragData.current = {
        ...dragData.current,
        originalX: event.clientX,
        originalY: event.clientY,
        startX: position.x,
        startY: position.y,
      };
      onMouseDown(event, id);
    },
    [id, position.x, position.y, onMouseDown, setDraggingItem],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const deltaX = event.clientX - dragData.current.originalX;
      const deltaY = event.clientY - dragData.current.originalY;
      const percentX = (deltaX / dragData.current.containerWidth) * 100;
      const percentY = (deltaY / dragData.current.containerHeight) * 100;

      const objectWidthInPercentage =
        (LINK_WIDTH_PX / dragData.current.containerWidth) * 100;
      const objectHeightInPercentage =
        (LINK_WIDTH_PX / dragData.current.containerHeight) * 100;

      const maxPercentX = 100 - objectWidthInPercentage;
      const maxPercentY = 100 - objectHeightInPercentage;

      const finalX = Math.min(
        Math.max(0, dragData.current.startX + percentX),
        maxPercentX,
      );
      const finalY = Math.min(
        Math.max(0, dragData.current.startY + percentY),
        maxPercentY,
      );

      setPosition({
        x: finalX,
        y: finalY,
      });
      onMouseMove(event, id);
    },
    [onMouseMove, id],
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      setDraggingItem(id);
      dragData.current = {
        ...dragData.current,
        originalX: event.touches[0].clientX,
        originalY: event.touches[0].clientY,
        startX: position.x,
        startY: position.y,
      };
    },
    [id, position.x, position.y, setDraggingItem],
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
          maxPercentX,
        );
        const finalY = Math.min(
          Math.max(0, dragData.current.startY + percentY),
          maxPercentY,
        );

        setPosition({
          x: finalX,
          y: finalY,
        });
      }
    },
    [draggingItem, id],
  );

  const stopDragging = useCallback(() => {
    setDraggingItem(null);
    callback(Number(id), {
      x: position.x,
      y: position.y,
    });
  }, [id, setDraggingItem, callback, position]);

  const updateContainerDimensions = useCallback((current: HTMLDivElement) => {
    const { width, height } = current.getBoundingClientRect();
    dragData.current.containerWidth = width;
    dragData.current.containerHeight = height;
  }, []);

  useEffect(() => {
    const current = containerRef?.current;
    if (current) {
      // Call initially to set the dimensions
      updateContainerDimensions(current);

      const resizeObserver = new ResizeObserver(() => {
        updateContainerDimensions(current);
      });
      resizeObserver.observe(current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerRef, updateContainerDimensions]);

  useEffect(() => {
    if (draggingItem === id) {
      // Mouse events
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDragging);
      document.body.style.overflow = "hidden";

      // Touch events
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", stopDragging);
    }

    return () => {
      // Mouse events
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      document.body.style.overflow = "";

      // Touch events
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [draggingItem, handleMouseMove, handleTouchMove, id, stopDragging]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      style={{
        ...rest.style,
        position: "absolute",
        width: `${LINK_WIDTH_PX}px`,
        height: `${LINK_HEIGHT_PX}px`,
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

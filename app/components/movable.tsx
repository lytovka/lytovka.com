import type { Dispatch } from "react";
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";

// Create a context to manage the dragging state globally

// Define the shape of the context
interface DraggingContextType {
  draggingItem: string | null;
  setDraggingItem: Dispatch<React.SetStateAction<string | null>>;
}

export const DraggingContext = React.createContext<DraggingContextType>({
  draggingItem: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDraggingItem: () => {},
});

// Types for the position and drag data
interface Position {
  x: number;
  y: number;
}

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

export const MovableComponent = ({ id }: { id: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragData = useRef<DragData>({
    originalX: 0,
    originalY: 0,
    startX: 0,
    startY: 0,
    containerHeight: 0,
    containerWidth: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { draggingItem, setDraggingItem } = useDragging();

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      dragData.current.containerWidth = width;
      dragData.current.containerHeight = height;
      console.log("useEffect", width, height);
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: { clientX: number; clientY: number }) => {
      console.log("handleMouseMove", draggingItem);
      if (draggingItem === id) {
        const deltaX = event.clientX - dragData.current.originalX;
        const deltaY = event.clientY - dragData.current.originalY;
        const percentX = (deltaX / dragData.current.containerWidth) * 100;
        const percentY = (deltaY / dragData.current.containerHeight) * 100;

        // console.log({
        //   deltaX,
        //   deltaY,
        //   widthX: dragData.current.containerWidth,
        //   widthY: dragData.current.containerHeight,
        // });

        setPosition({
          x: dragData.current.startX + percentX,
          y: dragData.current.startY + percentY,
        });
      }
    },
    [draggingItem, id]
  );

  const stopDragging = useCallback(() => {
    console.log("stopDragging");
    if (draggingItem === id) {
      setDraggingItem(null);
    }
  }, [draggingItem, id, setDraggingItem]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      console.log("handleMouseDown");
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

        setPosition({
          x: Math.max(0, dragData.current.startX + percentX),
          y: Math.max(0, dragData.current.startY + percentY),
        });
      }
    },
    [draggingItem, id]
  );

  // Add event listeners
  useEffect(() => {
    if (draggingItem === id) {
      console.log("Adding global listeners");
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
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${position.y}%`,
          left: `${position.x}%`,
          width: "100px",
          height: "100px",
          background: "red",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Drag Me! {id} */}
      </div>
    </div>
  );
};

import type {
  PointerEvent,
  DragEvent,
  MouseEvent,
  PropsWithChildren,
  TouchEvent,
} from "react";
import { useState } from "react";

export const Draggable = ({ children }: PropsWithChildren<unknown>) => {
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event: PointerEvent) => {
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (isDragging) {
      // handleDragMove(event);
      setTranslate({
        x: translate.x + event.movementX,
        y: translate.y + event.movementY,
      });
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isDragging) {
      // handleDragMove(event);
      const touchLocation = event.targetTouches[0];
      setTranslate({
        x: translate.x + touchLocation.pageX,
        y: translate.y + touchLocation.pageY,
      });
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    setIsDragging(false);
  };

  const handlePointerLeave = (event: PointerEvent) => {
    setIsDragging(false);
  };

  const handleDragStart = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleOnClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onPointerUp={handlePointerUp}
      onClick={handleOnClick}
      style={{
        position: "absolute",
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
      }}
    >
      {children}
    </div>
  );
};

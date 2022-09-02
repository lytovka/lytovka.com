import type {
  PointerEvent,
  DragEvent,
  MouseEvent,
  PropsWithChildren,
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
      console.log(event.type);
      handleDragMove(event);
      setTranslate({
        x: translate.x + event.movementX,
        y: translate.y + event.movementY,
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

  const handleDragMove = (e: PointerEvent) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY,
    });
  };

  const handleOnClick = (event: MouseEvent<HTMLDivElement>) => {
    console.log(event.type);
    event.preventDefault();
  };

  return (
    <div
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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

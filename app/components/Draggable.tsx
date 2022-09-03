import type {
  DragEvent,
  MouseEvent,
  PropsWithChildren,
  TouchEvent,
} from "react";
import { useState, useRef } from "react";

export const Draggable = ({ children }: PropsWithChildren<unknown>) => {
  const [initial, setInitial] = useState({
    x: 0,
    y: 0,
  });

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });

  const offset = useRef({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
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
      const touchLocation = event.touches[0];

      setTranslate({
        x: touchLocation.clientX - initial.x,
        y: touchLocation.clientY - initial.y,
      });

      offset.current.x = touchLocation.clientX - initial.x;
      offset.current.y = touchLocation.clientY - initial.y;
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    setInitial({
      x: event.touches[0].clientX - offset.current.x,
      y: event.touches[0].clientY - offset.current.y,
    });
    setIsDragging(true);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    setIsDragging(false);
  };

  const handleMouseUp = (event: MouseEvent) => {
    setIsDragging(false);
  };

  const handleMouseLeave = (event: MouseEvent) => {
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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

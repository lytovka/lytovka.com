import type {
  DragEvent,
  MouseEvent,
  PropsWithChildren,
  TouchEvent,
} from "react";
import { useRef,useState } from "react";

export const Draggable = ({ children }: PropsWithChildren<unknown>) => {
  const [initial, setInitial] = useState({
    x: 0,
    y: 0,
  });
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });
  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  const ref = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: MouseEvent) => {
    setInitial({
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    if (isDragging) {
      // console.log(((event.clientX - initial.x) / screenWidth) * 100);
      // console.log(((event.clientY - initial.y) / screenHeight) * 100);
      setTranslate({
        x: ((event.clientX - initial.x + event.movementX) / screenWidth) * 100,
        y:
          ((event.clientY - initial.y + +event.movementY) / screenHeight) * 100,
      });
      setOffset({
        x: event.clientX - initial.x + event.movementX,
        y: event.clientY - initial.y + event.movementY,
      });
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    if (isDragging) {
      const touchLocation = event.touches[0];
      // console.log(((touchLocation.clientX - initial.x) / screenWidth) * 100);
      // console.log(((touchLocation.clientY - initial.y) / screenHeight) * 100);

      setTranslate({
        x: ((touchLocation.clientX - initial.x) / screenWidth) * 100,
        y: ((touchLocation.clientY - initial.y) / screenHeight) * 100,
      });

      offset.x = touchLocation.clientX - initial.x;
      offset.y = touchLocation.clientY - initial.y;
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    setInitial({
      x: event.touches[0].clientX - offset.x,
      y: event.touches[0].clientY - offset.y,
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
      ref={ref}
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
        left: `${translate.x}%`,
        top: `${translate.y}%`,
        // transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
      }}
    >
      {children}
    </div>
  );
};

import { PointerEvent, PropsWithChildren, DragEvent, useCallback } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

interface Props {
  onDragMove: (
    e: PointerEvent<HTMLDivElement> | DragEvent<HTMLDivElement>
  ) => void;
}

const Draggable = ({
  onDragMove,
  //   onPointerDown = () => {},
  //   onPointerUp = () => {},
  //   onPointerMove = () => {},
  //   className = "",
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState<{ x: number; y: number }>({ x: 0, y: 0 });


  const moveAt = useCallback(
    (pageX: number, pageY: number) => {
      if (divRef.current) {
        divRef.current.style.left = pageX - shift.x + "px";
        divRef.current.style.top = pageY - shift.y + "px";
      }
    },
    [shift.x, shift.y]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (divRef.current) {
        moveAt(event.pageX, event.pageY);
        console.log(divRef.current.style.left, divRef.current.style.top);
        //   onPointerMove(event);
      }
    },
    [moveAt]
  );

  const handlePointerUp = (e: PointerEvent) => {
    if (divRef.current) {
      console.log(e.type);
      divRef.current.removeEventListener("pointermove", handlePointerMove);
    }
  };

  const handleDragStart = (e: DragEvent) => {
    // this prevents the default browser action to avoid `onPointerCancel` event.
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    if(divRef.current) {
        divRef.current.addEventListener
    }
  }, [handlePointerDown])

  return (
    <div
      onDragStart={(e) => handleDragStart(e)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      //   className={className}
      ref={divRef}
      style={{ position: "absolute" }}
      //   {...rest}
    >
      {children}
    </div>
  );
};

export default Draggable;

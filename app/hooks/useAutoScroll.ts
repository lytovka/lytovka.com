import type React from "react";
import { useEffect, useRef } from "react";

export function useAutoScroll(
  containerRefs: React.RefObject<Array<HTMLDivElement | null>>,
) {
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const step = 1;
    const delay = 20;
    let fpsCheckTime = performance.now();

    const animate = (currentTime: number) => {
      if (currentTime - fpsCheckTime >= delay) {
        containerRefs.current.forEach((ref, index) => {
          if (!ref) return;
          const direction = index % 2 === 0 ? 1 : -1;
          ref.scrollLeft = Math.ceil(ref.scrollLeft + step * direction);
          if (direction === 1 && ref.scrollLeft >= ref.scrollWidth / 2) {
            ref.scrollLeft = 0;
          }
          if (direction === -1 && ref.scrollLeft <= 0) {
            ref.scrollLeft = ref.scrollWidth / 2;
          }
        });
        fpsCheckTime = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerRefs]);
}

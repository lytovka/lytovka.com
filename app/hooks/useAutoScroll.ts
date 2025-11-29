import { useEffect, useRef } from "react";

export function useAutoScroll(containerRefs: React.MutableRefObject<Array<HTMLDivElement | null>>) {
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0.5;
    let frameCount = 0;
    let fpsCheckTime = performance.now();

    const animate = (currentTime: number) => {
      frameCount++;

      if (currentTime - fpsCheckTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        fpsCheckTime = currentTime;

        if (fps < 30) {
          step = 0.3;
        } else if (fps < 50) {
          step = 0.4;
        } else {
          step = 0.5;
        }
      }

      containerRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const direction = index % 2 === 0 ? 1 : -1;
        ref.scrollLeft += step * direction;

        const maxScroll = ref.scrollWidth / 2;
        if (direction === 1 && ref.scrollLeft >= maxScroll) {
          ref.scrollLeft = 0;
        } else if (direction === -1 && ref.scrollLeft <= 0) {
          ref.scrollLeft = maxScroll;
        }
      });

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

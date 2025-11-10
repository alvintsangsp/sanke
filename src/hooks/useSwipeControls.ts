import { useEffect } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const SWIPE_THRESHOLD = 30;

export const useSwipeControls = (
  containerRef: React.RefObject<HTMLDivElement>,
  setDirection: (direction: Direction) => void,
  currentDirection: Direction
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX < SWIPE_THRESHOLD && absDeltaY < SWIPE_THRESHOLD) {
        return;
      }

      let newDirection: Direction;

      if (absDeltaX > absDeltaY) {
        newDirection = deltaX > 0 ? "RIGHT" : "LEFT";
      } else {
        newDirection = deltaY > 0 ? "DOWN" : "UP";
      }

      // Prevent 180-degree turns
      if (
        (currentDirection === "UP" && newDirection === "DOWN") ||
        (currentDirection === "DOWN" && newDirection === "UP") ||
        (currentDirection === "LEFT" && newDirection === "RIGHT") ||
        (currentDirection === "RIGHT" && newDirection === "LEFT")
      ) {
        return;
      }

      setDirection(newDirection);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, setDirection, currentDirection]);
};

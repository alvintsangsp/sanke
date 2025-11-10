import { useEffect, useRef, useState } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useSwipeControls } from "@/hooks/useSwipeControls";
import ControlButtons from "./ControlButtons";

interface GameCanvasProps {
  gameState: "idle" | "playing" | "gameover";
  onGameOver: () => void;
  isPaused: boolean;
  onScoreUpdate: (score: number) => void;
}

const GameCanvas = ({ gameState, onGameOver, isPaused, onScoreUpdate }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const { direction, setDirection } = useGameLoop(
    canvasRef,
    gameState,
    isPaused,
    onGameOver,
    onScoreUpdate,
    dimensions
  );

  useSwipeControls(containerRef, setDirection, direction);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.max(280, Math.min(rect.width - 32, rect.height - 200));
        setDimensions({ width: size, height: size });
      } else {
        // Fallback if container not ready
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const size = Math.max(280, Math.min(viewportWidth - 32, viewportHeight - 200));
        setDimensions({ width: size, height: size });
      }
    };

    // Immediate first call
    updateDimensions();
    
    // Also try after a brief delay in case layout isn't complete
    const timer = setTimeout(updateDimensions, 100);
    
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full pt-24 pb-32 px-4"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border-4 border-border rounded-lg shadow-2xl"
        style={{
          imageRendering: "pixelated",
          touchAction: "none",
        }}
      />
      <ControlButtons onDirectionChange={setDirection} />
    </div>
  );
};

export default GameCanvas;

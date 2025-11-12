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
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Reserve space for UI elements (minimized for mobile):
      // - HUD at top: ~44px (compact GameUI) + ~8px padding = ~52px
      // - Controls at bottom: ~140px (larger buttons, no hint on mobile) + ~16px padding = ~156px
      // - Additional margin: ~8px
      const hudHeight = 52;
      const controlsHeight = 156;
      const extraMargin = 8;
      const reservedHeight = hudHeight + controlsHeight + extraMargin;
      
      // Calculate available space - maximize game board
      const availableHeight = Math.max(200, viewportHeight - reservedHeight);
      // For mobile, use more of the width
      const maxGridWidth = viewportWidth <= 430 ? Math.min(viewportWidth - 24, 420) : 480;
      const availableWidth = Math.min(maxGridWidth, availableHeight);
      
      // Ensure minimum size for playability, but maximize available space
      const minSize = 300;
      const calculatedSize = Math.max(minSize, Math.min(availableWidth, availableHeight));
      
      // For very small screens, ensure grid doesn't overflow
      const finalSize = Math.min(calculatedSize, viewportWidth - 24);
      
      setDimensions({ width: finalSize, height: finalSize });
    };

    // Immediate first call
    updateDimensions();
    
    // Also try after a brief delay in case layout isn't complete
    const timer = setTimeout(updateDimensions, 100);
    const resizeTimer = setTimeout(updateDimensions, 300);
    
    window.addEventListener("resize", updateDimensions);
    // Handle orientation changes
    window.addEventListener("orientationchange", () => {
      setTimeout(updateDimensions, 200);
    });
    
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-start h-full w-full overflow-hidden"
    >
      {/* Game Grid - Maximized space, minimal padding */}
      <div className="flex-shrink-0 pt-2 sm:pt-4 px-3 pb-2">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="border-[3px] border-primary rounded-lg shadow-2xl block mx-auto"
          style={{
            imageRendering: "pixelated",
            touchAction: "none",
          }}
        />
      </div>
      
      {/* Control Buttons - Compact spacing with safe area */}
      <div className="flex-shrink-0 w-full px-3 pt-1 pb-3 sm:pb-4 safe-area-inset-bottom">
        <ControlButtons onDirectionChange={setDirection} />
      </div>
    </div>
  );
};

export default GameCanvas;

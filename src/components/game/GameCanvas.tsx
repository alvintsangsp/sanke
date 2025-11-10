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
      
      // Reserve space for UI elements:
      // - HUD at top: ~72px (GameUI) + ~16px padding = ~88px
      // - Controls at bottom: ~160px (buttons + hint) + ~24px padding = ~184px
      // - Additional margin: ~16px
      const hudHeight = 88;
      const controlsHeight = 184;
      const extraMargin = 16;
      const reservedHeight = hudHeight + controlsHeight + extraMargin;
      
      // Calculate available space
      const availableHeight = Math.max(200, viewportHeight - reservedHeight);
      // For mobile (320px-430px width), limit max width to prevent oversized grid
      const maxGridWidth = viewportWidth <= 430 ? Math.min(viewportWidth - 32, 380) : 400;
      const availableWidth = Math.min(maxGridWidth, availableHeight);
      
      // Ensure minimum size for playability, but don't exceed available space
      const minSize = 280;
      const calculatedSize = Math.max(minSize, Math.min(availableWidth, availableHeight));
      
      // For very small screens, ensure grid doesn't overflow
      const finalSize = Math.min(calculatedSize, viewportWidth - 32);
      
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
      {/* Game Grid - Positioned at top with proper spacing from HUD */}
      <div className="flex-shrink-0 pt-4 sm:pt-6 px-4 pb-4">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="border-4 border-primary rounded-lg shadow-2xl block mx-auto"
          style={{
            imageRendering: "pixelated",
            touchAction: "none",
          }}
        />
      </div>
      
      {/* Control Buttons - Positioned below grid with clear separation and safe area */}
      <div className="flex-shrink-0 w-full px-4 pt-2 pb-4 sm:pb-6 safe-area-inset-bottom">
        <ControlButtons onDirectionChange={setDirection} />
      </div>
    </div>
  );
};

export default GameCanvas;

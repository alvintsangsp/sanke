import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, type MouseEvent, type TouchEvent } from "react";

interface ControlButtonsProps {
  onDirectionChange: (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => void;
}

const ControlButtons = ({ onDirectionChange }: ControlButtonsProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleDirection = (newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT", event?: MouseEvent | TouchEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setActiveButton(newDirection);
    onDirectionChange(newDirection);
    // Reset active state after animation
    setTimeout(() => setActiveButton(null), 150);
  };

  const buttonClass = (direction: string) => {
    const baseClass = "min-w-[56px] min-h-[56px] w-14 h-14 sm:w-16 sm:h-16 bg-primary hover:bg-primary/90 border-2 border-primary-foreground/30 hover:border-primary-foreground/50 shadow-lg active:scale-90 transition-all duration-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";
    const activeClass = activeButton === direction ? "bg-primary scale-95 shadow-xl ring-4 ring-primary/70 border-primary-foreground" : "";
    return `${baseClass} ${activeClass}`;
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* D-pad style layout with proper spacing */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        {/* Up arrow - centered above */}
        <div className="flex justify-center">
          <Button
            onClick={(e) => handleDirection("UP", e)}
            onTouchStart={(e) => handleDirection("UP", e)}
            className={buttonClass("UP")}
            aria-label="Move up"
            type="button"
          >
            <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" strokeWidth={3} />
          </Button>
        </div>
        
        {/* Middle row: Left, Down, Right with proper spacing */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Button
            onClick={(e) => handleDirection("LEFT", e)}
            onTouchStart={(e) => handleDirection("LEFT", e)}
            className={buttonClass("LEFT")}
            aria-label="Move left"
            type="button"
          >
            <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" strokeWidth={3} />
          </Button>
          
          <Button
            onClick={(e) => handleDirection("DOWN", e)}
            onTouchStart={(e) => handleDirection("DOWN", e)}
            className={buttonClass("DOWN")}
            aria-label="Move down"
            type="button"
          >
            <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" strokeWidth={3} />
          </Button>
          
          <Button
            onClick={(e) => handleDirection("RIGHT", e)}
            onTouchStart={(e) => handleDirection("RIGHT", e)}
            className={buttonClass("RIGHT")}
            aria-label="Move right"
            type="button"
          >
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" strokeWidth={3} />
          </Button>
        </div>
      </div>
      
      {/* Swipe hint text - smaller and less prominent */}
      <p className="text-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground/70 font-pixel">
        Swipe or tap to move
      </p>
    </div>
  );
};

export default ControlButtons;

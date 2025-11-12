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
    const baseClass = "min-w-[64px] min-h-[64px] w-16 h-16 sm:w-20 sm:h-20 bg-primary hover:bg-primary/90 border-2 border-primary-foreground/30 hover:border-primary-foreground/50 shadow-lg active:scale-90 transition-all duration-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";
    const activeClass = activeButton === direction ? "bg-primary scale-95 shadow-xl ring-4 ring-primary/70 border-primary-foreground" : "";
    return `${baseClass} ${activeClass}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* D-pad style layout with proper spacing */}
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        {/* Up arrow - centered above */}
        <div className="flex justify-center">
          <Button
            onClick={(e) => handleDirection("UP", e)}
            onTouchStart={(e) => handleDirection("UP", e)}
            className={buttonClass("UP")}
            aria-label="Move up"
            type="button"
          >
            <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" strokeWidth={3} />
          </Button>
        </div>
        
        {/* Middle row: Left, Down, Right with proper spacing */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Button
            onClick={(e) => handleDirection("LEFT", e)}
            onTouchStart={(e) => handleDirection("LEFT", e)}
            className={buttonClass("LEFT")}
            aria-label="Move left"
            type="button"
          >
            <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" strokeWidth={3} />
          </Button>
          
          <Button
            onClick={(e) => handleDirection("DOWN", e)}
            onTouchStart={(e) => handleDirection("DOWN", e)}
            className={buttonClass("DOWN")}
            aria-label="Move down"
            type="button"
          >
            <ArrowDown className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" strokeWidth={3} />
          </Button>
          
          <Button
            onClick={(e) => handleDirection("RIGHT", e)}
            onTouchStart={(e) => handleDirection("RIGHT", e)}
            className={buttonClass("RIGHT")}
            aria-label="Move right"
            type="button"
          >
            <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" strokeWidth={3} />
          </Button>
        </div>
      </div>
      
      {/* Swipe hint text - hidden to save space */}
      <p className="text-center mt-2 text-[9px] text-muted-foreground/60 font-pixel hidden sm:block">
        Swipe or tap to move
      </p>
    </div>
  );
};

export default ControlButtons;

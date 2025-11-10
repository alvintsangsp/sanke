import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface ControlButtonsProps {
  onDirectionChange: (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => void;
}

const ControlButtons = ({ onDirectionChange }: ControlButtonsProps) => {
  const handleDirection = (newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
    onDirectionChange(newDirection);
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 px-4">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-start-2 flex justify-center">
            <Button
              onClick={() => handleDirection("UP")}
              size="lg"
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 border-2 border-primary"
            >
              <ArrowUp className="w-8 h-8 text-primary" />
            </Button>
          </div>
          
          <div className="col-start-1 flex justify-center">
            <Button
              onClick={() => handleDirection("LEFT")}
              size="lg"
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 border-2 border-primary"
            >
              <ArrowLeft className="w-8 h-8 text-primary" />
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => handleDirection("DOWN")}
              size="lg"
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 border-2 border-primary"
            >
              <ArrowDown className="w-8 h-8 text-primary" />
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => handleDirection("RIGHT")}
              size="lg"
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 border-2 border-primary"
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;

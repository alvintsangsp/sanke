import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2, VolumeX, Home } from "lucide-react";

interface GameUIProps {
  score: number;
  highScore: number;
  isPaused: boolean;
  onPause: () => void;
  onMute: () => void;
  isMuted: boolean;
  onHome: () => void;
}

const GameUI = ({ score, highScore, isPaused, onPause, onMute, isMuted, onHome }: GameUIProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={onHome}
          variant="outline"
          size="icon"
          className="bg-card/80 backdrop-blur border-border hover:bg-card"
        >
          <Home className="w-4 h-4 text-card-foreground" />
        </Button>

        <div className="flex-1 text-center space-y-1">
          <div className="font-pixel text-xs text-muted-foreground">
            Best: {highScore}
          </div>
          <div className="font-pixel text-2xl text-secondary">
            {score}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onMute}
            variant="outline"
            size="icon"
            className="bg-card/80 backdrop-blur border-border hover:bg-card"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-card-foreground" />
            ) : (
              <Volume2 className="w-4 h-4 text-card-foreground" />
            )}
          </Button>

          <Button
            onClick={onPause}
            variant="outline"
            size="icon"
            className="bg-card/80 backdrop-blur border-border hover:bg-card"
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-card-foreground" />
            ) : (
              <Pause className="w-4 h-4 text-card-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;

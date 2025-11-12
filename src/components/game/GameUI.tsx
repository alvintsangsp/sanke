import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2, VolumeX, Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-2 safe-area-inset-top">
      <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        {/* Home Button - Compact for mobile */}
        <Button
          onClick={onHome}
          variant="outline"
          size="icon"
          className="min-w-[40px] min-h-[40px] w-10 h-10 bg-card/90 backdrop-blur-sm border border-primary/50 hover:bg-card hover:border-primary touch-manipulation"
          aria-label={t("home")}
        >
          <Home className="w-4 h-4 text-primary" strokeWidth={2.5} />
        </Button>

        {/* Score Display - Centered & Compact */}
        <div className="flex-1 text-center px-2">
          <div className="font-pixel text-[10px] text-muted-foreground opacity-80">
            {t("best")}: {highScore}
          </div>
          <div className="font-pixel text-xl sm:text-2xl text-secondary font-bold drop-shadow-lg leading-tight">
            {score}
          </div>
        </div>

        {/* Control Buttons - Sound and Pause - Compact */}
        <div className="flex gap-1.5">
          <Button
            onClick={onMute}
            variant="outline"
            size="icon"
            className="min-w-[40px] min-h-[40px] w-10 h-10 bg-card/90 backdrop-blur-sm border border-primary/50 hover:bg-card hover:border-primary touch-manipulation"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-primary" strokeWidth={2.5} />
            ) : (
              <Volume2 className="w-4 h-4 text-primary" strokeWidth={2.5} />
            )}
          </Button>

          <Button
            onClick={onPause}
            variant="outline"
            size="icon"
            className="min-w-[40px] min-h-[40px] w-10 h-10 bg-card/90 backdrop-blur-sm border border-primary/50 hover:bg-card hover:border-primary touch-manipulation"
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-primary" strokeWidth={2.5} />
            ) : (
              <Pause className="w-4 h-4 text-primary" strokeWidth={2.5} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;

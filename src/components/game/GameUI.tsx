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
    <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 safe-area-inset-top">
      <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
        {/* Home Button - Larger for mobile */}
        <Button
          onClick={onHome}
          variant="outline"
          size="icon"
          className="min-w-[48px] min-h-[48px] w-12 h-12 bg-card/90 backdrop-blur-sm border-2 border-primary/50 hover:bg-card hover:border-primary touch-manipulation"
          aria-label={t("home")}
        >
          <Home className="w-5 h-5 text-primary" strokeWidth={2.5} />
        </Button>

        {/* Score Display - Centered */}
        <div className="flex-1 text-center space-y-1 px-2">
          <div className="font-pixel text-xs sm:text-sm text-muted-foreground opacity-90">
            {t("best")}: {highScore}
          </div>
          <div className="font-pixel text-2xl sm:text-3xl text-secondary font-bold drop-shadow-lg">
            {score}
          </div>
        </div>

        {/* Control Buttons - Sound and Pause */}
        <div className="flex gap-2">
          <Button
            onClick={onMute}
            variant="outline"
            size="icon"
            className="min-w-[48px] min-h-[48px] w-12 h-12 bg-card/90 backdrop-blur-sm border-2 border-primary/50 hover:bg-card hover:border-primary touch-manipulation"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-primary" strokeWidth={2.5} />
            ) : (
              <Volume2 className="w-5 h-5 text-primary" strokeWidth={2.5} />
            )}
          </Button>

          <Button
            onClick={onPause}
            variant="outline"
            size="icon"
            className="min-w-[48px] min-h-[48px] w-12 h-12 bg-card/90 backdrop-blur-sm border-2 border-primary/50 hover:bg-card hover:border-primary touch-manipulation"
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-primary" strokeWidth={2.5} />
            ) : (
              <Pause className="w-5 h-5 text-primary" strokeWidth={2.5} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;

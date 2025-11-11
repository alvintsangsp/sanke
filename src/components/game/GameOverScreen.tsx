import { Button } from "@/components/ui/button";
import { RotateCcw, Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
}

const GameOverScreen = ({ score, highScore, onRestart, onHome }: GameOverScreenProps) => {
  const isNewHighScore = score === highScore && score > 0;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="font-pixel text-2xl sm:text-3xl text-destructive">
            {t("gameOver")}
          </h1>
          
          {isNewHighScore && (
            <p className="font-pixel text-sm text-secondary animate-pulse">
              {t("newHighScore")}
            </p>
          )}

          <div className="space-y-2">
            <div className="font-pixel text-lg text-muted-foreground">
              {t("score")}
            </div>
            <div className="font-pixel text-4xl text-primary">
              {score}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-pixel text-xs text-muted-foreground">
              {t("best")}
            </div>
            <div className="font-pixel text-2xl text-secondary">
              {highScore}
            </div>
          </div>
        </div>

        <div className="space-y-3 w-full">
          <Button
            onClick={onRestart}
            size="lg"
            className="w-full font-pixel text-base sm:text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("playAgain")}
          </Button>

          <Button
            onClick={onHome}
            variant="outline"
            size="lg"
            className="w-full font-pixel text-sm sm:text-base h-12 border-primary text-primary hover:bg-primary/10"
          >
            <Home className="w-5 h-5 mr-2" />
            {t("home")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;

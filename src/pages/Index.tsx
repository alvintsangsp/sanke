import { useState } from "react";
import GameCanvas from "@/components/game/GameCanvas";
import GameUI from "@/components/game/GameUI";
import HomeScreen from "@/components/game/HomeScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import { useGame } from "@/hooks/useGame";

type Screen = "home" | "playing" | "gameover";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const game = useGame();

  const handleStartGame = () => {
    game.startGame();
    setScreen("playing");
  };

  const handleGameOver = () => {
    setScreen("gameover");
  };

  const handleRestart = () => {
    game.startGame();
    setScreen("playing");
  };

  const handleBackHome = () => {
    game.resetGame();
    setScreen("home");
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden touch-none no-select">
      {screen === "home" && <HomeScreen onStart={handleStartGame} />}
      
      {screen === "playing" && (
        <div className="h-full w-full flex flex-col relative">
          <GameUI
            score={game.score}
            highScore={game.highScore}
            isPaused={game.isPaused}
            onPause={game.togglePause}
            onMute={game.toggleMute}
            isMuted={game.isMuted}
            onHome={handleBackHome}
          />
          <div className="flex-1 overflow-hidden">
            <GameCanvas
              gameState={game.gameState}
              onGameOver={handleGameOver}
              isPaused={game.isPaused}
              onScoreUpdate={game.updateScore}
            />
          </div>
        </div>
      )}

      {screen === "gameover" && (
        <GameOverScreen
          score={game.score}
          highScore={game.highScore}
          onRestart={handleRestart}
          onHome={handleBackHome}
        />
      )}
    </div>
  );
};

export default Index;

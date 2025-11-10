import { useState, useEffect } from "react";

const HIGH_SCORE_KEY = "bitebite-highscore";
const MUTE_KEY = "bitebite-mute";

export const useGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem(MUTE_KEY);
    return saved === "true";
  });
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");

  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem(MUTE_KEY, isMuted.toString());
  }, [isMuted]);

  const updateScore = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  const startGame = () => {
    setScore(0);
    setIsPaused(false);
    setGameState("playing");
  };

  const resetGame = () => {
    setScore(0);
    setIsPaused(false);
    setGameState("idle");
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return {
    score,
    highScore,
    isPaused,
    isMuted,
    gameState,
    updateScore,
    startGame,
    resetGame,
    togglePause,
    toggleMute,
  };
};

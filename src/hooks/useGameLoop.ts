import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 15;
const BASE_TICK_MS = 180;
const TICK_FLOOR_MS = 80;
const TICK_DELTA_MS = 4;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export const useGameLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gameState: "idle" | "playing" | "gameover",
  isPaused: boolean,
  onGameOver: () => void,
  onScoreUpdate: (score: number) => void,
  dimensions: { width: number; height: number }
) => {
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [apple, setApple] = useState<Position>({ x: 10, y: 7 });
  const [score, setScore] = useState(0);
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const inputBufferRef = useRef<Direction[]>([]);

  const cellSize = dimensions.width / GRID_SIZE;

  const spawnApple = (currentSnake: Position[]) => {
    const freeCells: Position[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!currentSnake.some((s) => s.x === x && s.y === y)) {
          freeCells.push({ x, y });
        }
      }
    }
    if (freeCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * freeCells.length);
      return freeCells[randomIndex];
    }
    return { x: 10, y: 7 };
  };

  const checkCollision = (head: Position, body: Position[]): boolean => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const getCurrentTickSpeed = (currentScore: number): number => {
    const reduction = currentScore * TICK_DELTA_MS;
    return Math.max(TICK_FLOOR_MS, BASE_TICK_MS - reduction);
  };

  useEffect(() => {
    if (gameState === "playing") {
      setDirection("RIGHT");
      setSnake([{ x: 7, y: 7 }]);
      setApple({ x: 10, y: 7 });
      setScore(0);
      onScoreUpdate(0);
      inputBufferRef.current = [];
    }
  }, [gameState, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing" || isPaused || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      const currentTickSpeed = getCurrentTickSpeed(score);
      
      if (timestamp - lastUpdateRef.current >= currentTickSpeed) {
        lastUpdateRef.current = timestamp;

        // Process input buffer with 180-degree turn prevention
        let nextDirection = direction;
        if (inputBufferRef.current.length > 0) {
          const bufferedDirection = inputBufferRef.current.shift()!;
          // Prevent 180-degree turns
          const isOpposite = 
            (direction === "UP" && bufferedDirection === "DOWN") ||
            (direction === "DOWN" && bufferedDirection === "UP") ||
            (direction === "LEFT" && bufferedDirection === "RIGHT") ||
            (direction === "RIGHT" && bufferedDirection === "LEFT");
          
          if (!isOpposite) {
            nextDirection = bufferedDirection;
          }
        }
        
        const currentHead = snake[0];
        let newHead: Position;

        switch (nextDirection) {
          case "UP":
            newHead = { x: currentHead.x, y: currentHead.y - 1 };
            break;
          case "DOWN":
            newHead = { x: currentHead.x, y: currentHead.y + 1 };
            break;
          case "LEFT":
            newHead = { x: currentHead.x - 1, y: currentHead.y };
            break;
          case "RIGHT":
            newHead = { x: currentHead.x + 1, y: currentHead.y };
            break;
        }

        if (checkCollision(newHead, snake)) {
          onGameOver();
          return;
        }

        const newSnake = [newHead, ...snake];
        
        if (newHead.x === apple.x && newHead.y === apple.y) {
          const newScore = score + 1;
          setScore(newScore);
          onScoreUpdate(newScore);
          setApple(spawnApple(newSnake));
          setSnake(newSnake);
        } else {
          newSnake.pop();
          setSnake(newSnake);
        }

        setDirection(nextDirection);
      }

      // Render
      ctx.fillStyle = "#1a4d2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "#224d31";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw snake
      ctx.fillStyle = "#00ff41";
      snake.forEach((segment, index) => {
        const padding = index === 0 ? 1 : 2;
        ctx.fillRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
      });

      // Draw apple
      ctx.fillStyle = "#ff3b30";
      ctx.beginPath();
      const appleRadius = Math.max(2, cellSize / 2 - 2);
      ctx.arc(
        apple.x * cellSize + cellSize / 2,
        apple.y * cellSize + cellSize / 2,
        appleRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    canvasRef,
    gameState,
    isPaused,
    snake,
    apple,
    direction,
    score,
    onGameOver,
    onScoreUpdate,
    cellSize,
  ]);

  const handleDirectionChange = (newDirection: Direction) => {
    if (inputBufferRef.current.length < 2) {
      inputBufferRef.current.push(newDirection);
    }
  };

  return { direction, setDirection: handleDirectionChange };
};

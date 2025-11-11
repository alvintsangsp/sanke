import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 15;
const BASE_TICK_MS = 270; // 50% slower (was 180)
const TICK_FLOOR_MS = 120; // 50% slower (was 80)
const TICK_DELTA_MS = 6; // 50% slower progression (was 4)

// Initial snake length (2-3 segments for classic Snake feel)
const INITIAL_SNAKE_LENGTH = 3;

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
  // All game state stored in refs to avoid stale closures
  const gameStateRef = useRef({
    snake: [] as Position[],
    apple: { x: 0, y: 0 } as Position,
    direction: "RIGHT" as Direction,
    score: 0,
    inputBuffer: [] as Direction[],
  });
  
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const isInitializedRef = useRef(false);
  
  // UI state - only for display updates
  const [displayState, setDisplayState] = useState({
    snake: [] as Position[],
    apple: { x: 0, y: 0 } as Position,
    direction: "RIGHT" as Direction,
    score: 0,
  });

  const cellSize = dimensions.width / GRID_SIZE;

  // Initialize game state: snake in center with 2-3 segments, apple in random free cell
  const initializeGame = () => {
    // Start snake in center of grid, facing right
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);
    
    // Create initial snake with INITIAL_SNAKE_LENGTH segments, moving right
    const initialSnake: Position[] = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({ x: centerX - i, y: centerY });
    }
    
    // Spawn apple in a random free cell
    const freeCells: Position[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!initialSnake.some((s) => s.x === x && s.y === y)) {
          freeCells.push({ x, y });
        }
      }
    }
    
    const randomIndex = Math.floor(Math.random() * freeCells.length);
    const initialApple = freeCells.length > 0 ? freeCells[randomIndex] : { x: 10, y: 7 };
    
    // Update game state ref
    gameStateRef.current = {
      snake: initialSnake,
      apple: initialApple,
      direction: "RIGHT",
      score: 0,
      inputBuffer: [],
    };
    
    // Update display state
    setDisplayState({
      snake: initialSnake,
      apple: initialApple,
      direction: "RIGHT",
      score: 0,
    });
    
    onScoreUpdate(0);
    lastUpdateRef.current = 0;
    isInitializedRef.current = true;
  };

  // Spawn apple at a random empty cell (not occupied by snake)
  const spawnApple = (currentSnake: Position[]): Position => {
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
    
    // Fallback: return a default position (shouldn't happen in normal gameplay)
    return { x: 0, y: 0 };
  };

  // Check if head collides with walls or body segments
  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Check self-collision (exclude tail which will be removed)
    const bodyWithoutTail = snakeBody.slice(0, -1);
    return bodyWithoutTail.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  // Calculate game speed based on score
  const getCurrentTickSpeed = (currentScore: number): number => {
    const reduction = currentScore * TICK_DELTA_MS;
    return Math.max(TICK_FLOOR_MS, BASE_TICK_MS - reduction);
  };

  // Initialize game when starting
  useEffect(() => {
    if (gameState === "playing" && !isInitializedRef.current) {
      initializeGame();
    } else if (gameState !== "playing") {
      isInitializedRef.current = false;
    }
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing" || isPaused || dimensions.width === 0 || !isInitializedRef.current) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      const state = gameStateRef.current;
      const currentTickSpeed = getCurrentTickSpeed(state.score);
      
      // Update game logic at fixed intervals
      if (timestamp - lastUpdateRef.current >= currentTickSpeed) {
        lastUpdateRef.current = timestamp;

        // Process input with 180-degree turn prevention
        let nextDirection = state.direction;
        if (state.inputBuffer.length > 0) {
          const bufferedDirection = state.inputBuffer.shift()!;
          const isOpposite = 
            (state.direction === "UP" && bufferedDirection === "DOWN") ||
            (state.direction === "DOWN" && bufferedDirection === "UP") ||
            (state.direction === "LEFT" && bufferedDirection === "RIGHT") ||
            (state.direction === "RIGHT" && bufferedDirection === "LEFT");
          
          if (!isOpposite) {
            nextDirection = bufferedDirection;
          }
        }
        
        // Calculate new head position
        const currentHead = state.snake[0];
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

        // Check collision
        if (checkCollision(newHead, state.snake)) {
          onGameOver();
          return;
        }

        // Check if apple eaten
        const ateApple = newHead.x === state.apple.x && newHead.y === state.apple.y;

        // Update snake
        let newSnake: Position[];
        
        if (ateApple) {
          // Grow snake - don't remove tail
          newSnake = [newHead, ...state.snake];
          
          // Update score
          const newScore = state.score + 1;
          gameStateRef.current.score = newScore;
          onScoreUpdate(newScore);
          
          // Spawn new apple
          const newApple = spawnApple(newSnake);
          gameStateRef.current.apple = newApple;
          
          console.log("🍎 Apple eaten! Length:", newSnake.length, "Score:", newScore);
        } else {
          // Move snake - remove tail
          newSnake = [newHead, ...state.snake];
          newSnake.pop();
        }

        // Update game state
        gameStateRef.current.snake = newSnake;
        gameStateRef.current.direction = nextDirection;
        
        // Update display (throttled)
        setDisplayState({
          snake: newSnake,
          apple: gameStateRef.current.apple,
          direction: nextDirection,
          score: gameStateRef.current.score,
        });
      }

      // Render current state
      const renderState = gameStateRef.current;
      
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
      renderState.snake.forEach((segment, index) => {
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
        renderState.apple.x * cellSize + cellSize / 2,
        renderState.apple.y * cellSize + cellSize / 2,
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
  }, [gameState, isPaused, dimensions.width, cellSize, onGameOver, onScoreUpdate]);

  const handleDirectionChange = (newDirection: Direction) => {
    if (gameStateRef.current.inputBuffer.length < 2) {
      gameStateRef.current.inputBuffer.push(newDirection);
    }
  };

  return { 
    direction: displayState.direction, 
    setDirection: handleDirectionChange 
  };
};

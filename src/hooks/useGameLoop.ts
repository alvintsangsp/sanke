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
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [snake, setSnake] = useState<Position[]>([]);
  const [apple, setApple] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const inputBufferRef = useRef<Direction[]>([]);

  const cellSize = dimensions.width / GRID_SIZE;

  // Initialize game state: snake in center with 2-3 segments, apple in random free cell
  const initializeGame = (): { snake: Position[]; apple: Position; direction: Direction } => {
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
    
    let initialApple: Position;
    if (freeCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * freeCells.length);
      initialApple = freeCells[randomIndex];
    } else {
      // Fallback (shouldn't happen with proper grid size)
      initialApple = { x: 10, y: 7 };
    }
    
    return {
      snake: initialSnake,
      apple: initialApple,
      direction: "RIGHT",
    };
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
  // Checks wall boundaries and self-collision with body (excluding tail which will be removed)
  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    // Check wall collision: head outside grid bounds
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Check self-collision: head collides with any body segment
    // Exclude the tail since it will be removed on the next move (unless apple is eaten)
    // For collision check, we check against all segments except the tail
    const bodyWithoutTail = snakeBody.slice(0, -1);
    return bodyWithoutTail.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  // Calculate game speed based on score (increases difficulty)
  const getCurrentTickSpeed = (currentScore: number): number => {
    const reduction = currentScore * TICK_DELTA_MS;
    return Math.max(TICK_FLOOR_MS, BASE_TICK_MS - reduction);
  };

  // Initialize game when state changes to "playing"
  useEffect(() => {
    if (gameState === "playing") {
      const initialState = initializeGame();
      setDirection(initialState.direction);
      setSnake(initialState.snake);
      setApple(initialState.apple);
      setScore(0);
      onScoreUpdate(0);
      inputBufferRef.current = [];
      lastUpdateRef.current = 0;
    }
  }, [gameState, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing" || isPaused || dimensions.width === 0 || snake.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      const currentTickSpeed = getCurrentTickSpeed(score);
      
      if (timestamp - lastUpdateRef.current >= currentTickSpeed) {
        lastUpdateRef.current = timestamp;

        // === STEP 1: Get player input (direction) ===
        // Process input buffer with 180-degree turn prevention
        let nextDirection = direction;
        if (inputBufferRef.current.length > 0) {
          const bufferedDirection = inputBufferRef.current.shift()!;
          // Prevent 180-degree turns (direct reversal)
          const isOpposite = 
            (direction === "UP" && bufferedDirection === "DOWN") ||
            (direction === "DOWN" && bufferedDirection === "UP") ||
            (direction === "LEFT" && bufferedDirection === "RIGHT") ||
            (direction === "RIGHT" && bufferedDirection === "LEFT");
          
          if (!isOpposite) {
            nextDirection = bufferedDirection;
          }
        }
        
        // === STEP 2: Move snake's head one cell forward in current direction ===
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

        // === STEP 3: Check for collision BEFORE updating snake ===
        // If collision detected, end game immediately
        if (checkCollision(newHead, snake)) {
          onGameOver();
          return; // Exit game loop
        }

        // === STEP 4: Check if snake's head enters a cell with the apple ===
        const ateApple = newHead.x === apple.x && newHead.y === apple.y;

        // === STEP 5: Update snake based on whether apple was eaten ===
        let newSnake: Position[];
        
        if (ateApple) {
          console.log("🍎 APPLE EATEN! Snake length before:", snake.length);
          // Apple eaten: DO NOT remove tail (snake grows by 1 segment)
          // Prepend new head to snake body - this increases length
          newSnake = [newHead, ...snake];
          console.log("🍎 Snake length after:", newSnake.length);
          
          // Increase score by 1
          const newScore = score + 1;
          setScore(newScore);
          onScoreUpdate(newScore);
          
          // Move apple to a new random empty cell (not occupied by snake)
          const newApple = spawnApple(newSnake);
          setApple(newApple);
        } else {
          // No apple eaten: remove tail segment (snake does not grow)
          // Prepend new head and remove tail to maintain same length
          newSnake = [newHead, ...snake];
          newSnake.pop(); // Remove tail to keep same length
        }

        // === STEP 6: Update game state and continue game loop ===
        setSnake(newSnake);
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

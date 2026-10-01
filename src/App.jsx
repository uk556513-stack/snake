import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const INITIAL_DIRECTION = { x: 0, y: -1 };

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const foodRef = useRef(food);
  foodRef.current = food;

  const generateFood = (currentSnake) => {
    let newFood;

    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      const isOnSnake = currentSnake.some(
        (segment) =>
          segment.x === newFood.x &&
          segment.y === newFood.y
      );

      if (!isOnSnake) break;
    }

    return newFood;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) {
            setDirection({ x: 0, y: -1 });
          }
          break;

        case 'ArrowDown':
          if (directionRef.current.y === 0) {
            setDirection({ x: 0, y: 1 });
          }
          break;

        case 'ArrowLeft':
          if (directionRef.current.x === 0) {
            setDirection({ x: -1, y: 0 });
          }
          break;

        case 'ArrowRight':
          if (directionRef.current.x === 0) {
            setDirection({ x: 1, y: 0 });
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () =>
      window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        head.x += directionRef.current.x;
        head.y += directionRef.current.y;

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        for (let segment of prevSnake) {
          if (
            head.x === segment.x &&
            head.y === segment.y
          ) {
            setGameOver(true);
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        if (
          head.x === foodRef.current.x &&
          head.y === foodRef.current.y
        ) {
          setScore((prevScore) => prevScore + 1);

          const nextFood = generateFood(newSnake);
          setFood(nextFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 140);

    return () => clearInterval(gameInterval);
  }, [gameOver]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="game-container">
      <div className="game-title">

        <svg className="title-logo" viewBox="0 0 100 100">
          <defs>
            <linearGradient
              id="logoSnakeGradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#064d25"
              />

              <stop
                offset="35%"
                stopColor="#16a34a"
              />

              <stop
                offset="70%"
                stopColor="#6dff3f"
              />

              <stop
                offset="100%"
                stopColor="#b7ff6b"
              />
            </linearGradient>

            <filter
              id="logoGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="2.5"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#logoGlow)">

            <path
              d="M20 75 C17 62 22 48 34 43 C46 38 57 44 57 54 C57 63 49 68 40 65 C32 62 32 53 38 47"
              fill="none"
              stroke="#021b0c"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M20 75 C17 62 22 48 34 43 C46 38 57 44 57 54 C57 63 49 68 40 65 C32 62 32 53 38 47"
              fill="none"
              stroke="url(#logoSnakeGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M23 70 C21 58 25 50 34 46"
              fill="none"
              stroke="#d2ff9f"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />

            <g transform="translate(57 54) rotate(-10)">

              <ellipse
                cx="0"
                cy="0"
                rx="11"
                ry="8.5"
                fill="url(#logoSnakeGradient)"
              />

              <ellipse
                cx="-3"
                cy="-4"
                rx="3"
                ry="2"
                fill="#dfffbd"
                opacity="0.6"
              />

              <circle
                cx="-4"
                cy="-2.5"
                r="2.3"
                fill="#ffffff"
              />

              <circle
                cx="-4"
                cy="-2.5"
                r="1"
                fill="#001b0b"
              />

              <circle
                cx="4"
                cy="-2.5"
                r="2.3"
                fill="#ffffff"
              />

              <circle
                cx="4"
                cy="-2.5"
                r="1"
                fill="#001b0b"
              />

              <path
                d="M10 2 L17 3"
                fill="none"
                stroke="#ff4141"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M17 3 L14 1 M17 3 L14 5"
                fill="none"
                stroke="#ff4141"
                strokeWidth="1"
                strokeLinecap="round"
              />

            </g>
          </g>
        </svg>

        <h1>SNAKE GAME</h1>
      </div>

      <div className="game-board-container">
        <svg
          className="game-board"
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          viewBox={`0 0 ${GRID_SIZE * CELL_SIZE} ${GRID_SIZE * CELL_SIZE}`}
        >
          <defs>
            <pattern
              id="backgroundPattern"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="100"
                height="100"
                fill="#07100b"
              />

              <path
                d="M10 10 H90 V35 H55 V75 H90 M10 90 H40 V55 H10 M65 10 V25 H45 M75 45 H95 V65 H70"
                fill="none"
                stroke="#10251a"
                strokeWidth="1"
              />

              <path
                d="M20 0 V35 M50 35 V100 M80 0 V25 M0 50 H30 M55 80 H100"
                fill="none"
                stroke="#0c1b13"
                strokeWidth="1"
              />
            </pattern>

            <linearGradient
              id="snakeBody"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#c5ff86" />
              <stop offset="25%" stopColor="#42e66b" />
              <stop offset="60%" stopColor="#079447" />
              <stop offset="100%" stopColor="#01391d" />
            </linearGradient>

            <radialGradient
              id="snakeHead"
              cx="35%"
              cy="30%"
              r="75%"
            >
              <stop offset="0%" stopColor="#d1ff9c" />
              <stop offset="25%" stopColor="#5df274" />
              <stop offset="65%" stopColor="#12a64c" />
              <stop offset="100%" stopColor="#034d25" />
            </radialGradient>

            <radialGradient
              id="foodGradient"
              cx="30%"
              cy="25%"
              r="70%"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#ffb0b0" />
              <stop offset="45%" stopColor="#ff3939" />
              <stop offset="75%" stopColor="#d71919" />
              <stop offset="100%" stopColor="#650909" />
            </radialGradient>

            <filter
              id="snakeGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="1.5"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="foodGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="2.5"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x="0"
            y="0"
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            fill="url(#backgroundPattern)"
          />

          <rect
            x="0.5"
            y="0.5"
            width={GRID_SIZE * CELL_SIZE - 1}
            height={GRID_SIZE * CELL_SIZE - 1}
            fill="none"
            stroke="#183524"
            strokeWidth="1"
          />

          <g filter="url(#foodGlow)">
            <circle
              cx={food.x * CELL_SIZE + CELL_SIZE / 2}
              cy={food.y * CELL_SIZE + CELL_SIZE / 2}
              r="7"
              fill="url(#foodGradient)"
            />

            <circle
              cx={food.x * CELL_SIZE + 8}
              cy={food.y * CELL_SIZE + 7}
              r="2"
              fill="#ffffff"
              opacity="0.9"
            />

            <circle
              cx={food.x * CELL_SIZE + 14}
              cy={food.y * CELL_SIZE + 14}
              r="1"
              fill="#ffb3b3"
              opacity="0.7"
            />

            <path
              d={`M ${food.x * CELL_SIZE + 10} ${food.y * CELL_SIZE + 4} Q ${food.x * CELL_SIZE + 11} ${food.y * CELL_SIZE - 1} ${food.x * CELL_SIZE + 14} ${food.y * CELL_SIZE}`}
              fill="none"
              stroke="#4d7c0f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          <g filter="url(#snakeGlow)">
            {snake.length > 1 && (
              <polyline
                points={snake
                  .map(
                    (segment) =>
                      `${segment.x * CELL_SIZE + 10},${segment.y * CELL_SIZE + 10}`
                  )
                  .join(' ')}
                fill="none"
                stroke="#032a16"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {snake.length > 1 && (
              <polyline
                points={snake
                  .map(
                    (segment) =>
                      `${segment.x * CELL_SIZE + 10},${segment.y * CELL_SIZE + 10}`
                  )
                  .join(' ')}
                fill="none"
                stroke="url(#snakeBody)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {snake.slice(1).map((segment, index) => {
              const cx = segment.x * CELL_SIZE + 10;
              const cy = segment.y * CELL_SIZE + 10;

              return (
                <g
                  key={`body-${segment.x}-${segment.y}-${index}`}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="url(#snakeBody)"
                  />

                  <circle
                    cx={cx - 1.7}
                    cy={cy - 2}
                    r="1.5"
                    fill="#caffc8"
                    opacity="0.9"
                  />
                </g>
              );
            })}

            {snake.length > 0 && (
              <g
                transform={`translate(${snake[0].x * CELL_SIZE + 10},${snake[0].y * CELL_SIZE + 10})`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="7.5"
                  ry="9"
                  fill="url(#snakeHead)"
                />

                <ellipse
                  cx="-2"
                  cy="-4"
                  rx="2.5"
                  ry="2"
                  fill="#d8ffb7"
                  opacity="0.45"
                />

                <circle
                  cx="-3"
                  cy="-3"
                  r="2.2"
                  fill="#ffffff"
                />

                <circle
                  cx="-3"
                  cy="-3"
                  r="1"
                  fill="#001b0b"
                />

                <circle
                  cx="3"
                  cy="-3"
                  r="2.2"
                  fill="#ffffff"
                />

                <circle
                  cx="3"
                  cy="-3"
                  r="1"
                  fill="#001b0b"
                />

                <path
                  d="M0 7 L0 13 M0 12 L-3 10 M0 12 L3 10"
                  fill="none"
                  stroke="#ff4b4b"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        </svg>

        {gameOver && (
          <div className="game-over-overlay">
            <h2>GAME OVER!</h2>

            <button
              className="restart-btn"
              onClick={handleRestart}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="controls-panel">
        <div className="score-display">
          Score: <span>{score}</span>
        </div>

        <button
          className="restart-btn"
          onClick={handleRestart}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default App;
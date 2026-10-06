import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
  { x: 11, y: 13 },
  { x: 12, y: 13 },
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

  /*
  ============================================================
  SNAKE SVG (IMPROVED CLEAR & REALISTIC BODY)
  ============================================================
  */

  const renderSnake = () => {
    if (!snake || snake.length === 0) return null;

    // Convert cell coordinates to pixel center points
    const points = snake.map((s) => ({
      x: s.x * CELL_SIZE + CELL_SIZE / 2,
      y: s.y * CELL_SIZE + CELL_SIZE / 2,
    }));

    const head = points[0];

    // Calculate actual head direction
    let angle = 0;
    if (directionRef.current.x === 1) angle = 90;
    else if (directionRef.current.x === -1) angle = -90;
    else if (directionRef.current.y === 1) angle = 180;
    else if (directionRef.current.y === -1) angle = 0;

    // Smooth Curved Path for Body
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }
    const lastPoint = points[points.length - 1];
    d += ` L ${lastPoint.x} ${lastPoint.y}`;

    return (
      <g className="snake-layer">
        {/* Deep Drop Shadow for Body Visibility against Grid */}
        <path
          d={d}
          fill="none"
          stroke="#000000"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
          transform="translate(2, 3)"
        />

        {/* Outer Dark Green Border (Gives clear outline) */}
        <path
          d={d}
          fill="none"
          stroke="#011e0e"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Main Vibrant Snake Body */}
        <path
          d={d}
          fill="none"
          stroke="url(#snakeBody)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glossy 3D Highlight Line (Top Spine Shine) */}
        <path
          d={d}
          fill="none"
          stroke="#b7ff6b"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Segmented Scale Knots / Rings along the Body */}
        {points.map((pt, idx) => {
          if (idx === 0) return null; // Skip Head
          return (
            <g key={`segment-${idx}`}>
              {/* Outer Scale Circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="6.5"
                fill="#16a34a"
                stroke="#023b1d"
                strokeWidth="1"
              />
              {/* Inner Scale Light Specular */}
              <circle
                cx={pt.x - 1.5}
                cy={pt.y - 1.5}
                r="2.5"
                fill="#d3ff91"
                opacity="0.9"
              />
            </g>
          );
        })}

        {/* Tapered Snake Tail Tip */}
        {points.length > 1 && (() => {
          const tail = points[points.length - 1];
          const prev = points[points.length - 2];
          const dx = tail.x - prev.x;
          const dy = tail.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const tx = tail.x + (dx / len) * 4;
          const ty = tail.y + (dy / len) * 4;

          return (
            <circle
              cx={tx}
              cy={ty}
              r="3.5"
              fill="#012f18"
              stroke="#6dff3f"
              strokeWidth="1"
            />
          );
        })()}

        {/* Snake Head */}
        <g transform={`translate(${head.x}, ${head.y}) rotate(${angle})`}>
          {/* Head Shadow */}
          <ellipse cx="0" cy="0" rx="10" ry="12" fill="#000000" opacity="0.4" />

          {/* Head Outer Base */}
          <path
            d="M -8 5 C -10 0, -9 -9, 0 -12 C 9 -9, 10 0, 8 5 C 6 10, -6 10, -8 5 Z"
            fill="#012c14"
          />

          {/* Head Main Gradient */}
          <path
            d="M -7 4 C -9 -1, -8 -8, 0 -11 C 8 -8, 9 -1, 7 4 C 5 9, -5 9, -7 4 Z"
            fill="url(#snakeHead)"
          />

          {/* Left Eye */}
          <circle cx="-4.5" cy="-3.5" r="3" fill="#ffffff" />
          <circle cx="-4.5" cy="-4" r="1.4" fill="#001308" />
          <circle cx="-5" cy="-4.5" r="0.6" fill="#ffffff" />

          {/* Right Eye */}
          <circle cx="4.5" cy="-3.5" r="3" fill="#ffffff" />
          <circle cx="4.5" cy="-4" r="1.4" fill="#001308" />
          <circle cx="4" cy="-4.5" r="0.6" fill="#ffffff" />

          {/* Nostrils */}
          <circle cx="-1.8" cy="-9" r="0.7" fill="#032b16" />
          <circle cx="1.8" cy="-9" r="0.7" fill="#032b16" />

          {/* Forked Tongue */}
          <path
            d="M 0 -11 L 0 -17 M 0 -17 L -3 -20 M 0 -17 L 3 -20"
            fill="none"
            stroke="#ff3e4d"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    );
  };

  return (
    <div className="game-container">

      {/* =====================================================
          TITLE
      ===================================================== */}

      <div className="game-title">

        <svg
          className="title-logo"
          viewBox="0 0 100 100"
        >

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
              d="
                M20 75
                C17 62 22 48 34 43
                C46 38 57 44 57 54
                C57 63 49 68 40 65
                C32 62 32 53 38 47
              "
              fill="none"
              stroke="#021b0c"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="
                M20 75
                C17 62 22 48 34 43
                C46 38 57 44 57 54
                C57 63 49 68 40 65
                C32 62 32 53 38 47
              "
              fill="none"
              stroke="url(#logoSnakeGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g transform="translate(57 54)">

              <ellipse
                cx="0"
                cy="0"
                rx="11"
                ry="8.5"
                fill="url(#logoSnakeGradient)"
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

            </g>

          </g>

        </svg>

        <h1>SNAKE GAME</h1>

      </div>


      {/* =====================================================
          BOARD
      ===================================================== */}

      <div className="game-board-container">

        <svg
          className="game-board"
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          viewBox={`0 0 ${GRID_SIZE * CELL_SIZE} ${GRID_SIZE * CELL_SIZE}`}
        >

          <defs>

            {/* Background Pattern */}

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
                d="
                  M10 10 H90
                  V35 H55
                  V75 H90
                  M10 90 H40
                  V55 H10
                  M65 10 V25 H45
                  M75 45 H95 V65 H70
                "
                fill="none"
                stroke="#10251a"
                strokeWidth="1"
              />

              <path
                d="
                  M20 0 V35
                  M50 35 V100
                  M80 0 V25
                  M0 50 H30
                  M55 80 H100
                "
                fill="none"
                stroke="#0c1b13"
                strokeWidth="1"
              />

            </pattern>


            {/* Body Gradient */}

            <linearGradient
              id="snakeBody"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#d3ff91"
              />

              <stop
                offset="25%"
                stopColor="#51ed72"
              />

              <stop
                offset="55%"
                stopColor="#0caf50"
              />

              <stop
                offset="80%"
                stopColor="#057b3b"
              />

              <stop
                offset="100%"
                stopColor="#012f18"
              />

            </linearGradient>


            {/* Head Gradient */}

            <radialGradient
              id="snakeHead"
              cx="30%"
              cy="20%"
              r="85%"
            >

              <stop
                offset="0%"
                stopColor="#efffcf"
              />

              <stop
                offset="20%"
                stopColor="#a0ff73"
              />

              <stop
                offset="45%"
                stopColor="#42e967"
              />

              <stop
                offset="70%"
                stopColor="#0ca348"
              />

              <stop
                offset="100%"
                stopColor="#023b1d"
              />

            </radialGradient>


            {/* Food Gradient */}

            <radialGradient
              id="foodGradient"
              cx="30%"
              cy="25%"
              r="70%"
            >

              <stop
                offset="0%"
                stopColor="#ffffff"
              />

              <stop
                offset="15%"
                stopColor="#ffb0b0"
              />

              <stop
                offset="45%"
                stopColor="#ff3939"
              />

              <stop
                offset="75%"
                stopColor="#d71919"
              />

              <stop
                offset="100%"
                stopColor="#650909"
              />

            </radialGradient>


            {/* Food Glow */}

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


          {/* =====================================================
              BACKGROUND
          ===================================================== */}

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


          {/* =====================================================
              FOOD
          ===================================================== */}

          <g filter="url(#foodGlow)">

            <circle
              cx={
                food.x * CELL_SIZE +
                CELL_SIZE / 2
              }
              cy={
                food.y * CELL_SIZE +
                CELL_SIZE / 2
              }
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
              d={`
                M ${food.x * CELL_SIZE + 10}
                  ${food.y * CELL_SIZE + 4}

                Q ${food.x * CELL_SIZE + 11}
                  ${food.y * CELL_SIZE - 1}

                  ${food.x * CELL_SIZE + 14}
                  ${food.y * CELL_SIZE}
              `}
              fill="none"
              stroke="#4d7c0f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

          </g>


          {/* =====================================================
              SNAKE SVG
          ===================================================== */}

          {renderSnake()}

        </svg>


        {/* =====================================================
            GAME OVER
        ===================================================== */}

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


      {/* =====================================================
          CONTROLS
      ===================================================== */}

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
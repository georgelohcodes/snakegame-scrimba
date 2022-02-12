import "./App.css";
import { useState, useEffect } from "react";

const width = 10; // num of grid in one row

const squares = [];
for (let i = 0; i < 100; i++) {
  squares.push(i);
}

function App() {
  const [gridItems, setGridItems] = useState(() => squares);
  const [speed, setSpeed] = useState(() => 750);
  const [difficulty, setDifficulty] = useState("normal");

  const [direction, setDirection] = useState(1);
  const [snakePosition, setSnakePosition] = useState([2, 1, 0]);
  const [applePosition, setApplePosition] = useState(5);

  const [gameStart, setGameStart] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (gameStart) {
      const interval = setInterval(() => move(), speed);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    const dom = document.addEventListener("keydown", changeDirection);
    return () => dom.removeEventListener("keydown", changeDirection);
  }, []);

  useEffect(() => {
    checkAppleAte();
  }, [snakePosition]);

  useEffect(() => {
    // change speed when difficulty is changed
    selectDifficulty();
  }, [difficulty]);

  function move() {
    // make copy
    const snakePositionCopy = [...snakePosition];
    // take out last elem from arr
    const tail = snakePositionCopy.pop();
    // if game has not ended, add square in direction we are heading
    if (!checkEndGame(snakePositionCopy)) {
      snakePositionCopy.unshift(snakePosition[0] + direction);
      setSnakePosition(snakePositionCopy);
    }
  }

  function checkEndGame(arr) {
    const head = arr[0];
    if (
      (head % width === 0 && direction === -1) || // left
      (head % width === 9 && direction === 1) || // right
      (head + width >= 100 && direction === width) ||
      (head - width < 0 && direction === -width) ||
      hasDuplicates(arr)
    ) {
      console.log("Touched a wall!");
      setGameStart(false);
      if (score > highScore) {
        setHighScore(score);
      }
      return true;
    }
  }

  function resetGame() {
    setSnakePosition([2, 1, 0]);
    setApplePosition(5);
    setDirection(1);
    setScore(0);
    setGameStart(true);
  }

  function changeDirection(e) {
    switch (e.keyCode) {
      case 37: // left
        setDirection(-1);
        break;
      case 38: // up
        setDirection(-width);
        break;
      case 39: // right
        setDirection(1);
        break;
      case 40: // down
        setDirection(width);
        break;
      default:
        break;
    }
  }

  function checkAppleAte() {
    if (snakePosition[0] === applePosition) {
      setSnakePosition([...snakePosition, snakePosition[-1] + direction]);
      setApplePosition(Math.floor(Math.random() * 100));
      setScore((prev) => prev + 1);
    }
  }

  function selectDifficulty() {
    switch (difficulty) {
      case "easy":
        setSpeed(750);
        break;
      case "normal":
        setSpeed(500);
        break;
      case "hard":
        setSpeed(350);
        break;
      default:
        break;
    }
  }

  // helper functions
  function hasDuplicates(a) {
    const noDups = new Set(a);
    return a.length !== noDups.size;
  }

  return (
    <div className="App">
      <h1>Snake Game</h1>
      <h3>Use up, down, left, right arrows to move</h3>

      {!gameStart && (
        <select
          name="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      )}

      {!gameStart && highScore > 0 && <h2> Game Over! </h2>}
      {!gameStart && (
        <button onClick={() => resetGame()}>
          {highScore > 0 ? "Reset Game" : "Start Game"}
        </button>
      )}

      <h2>High Score : {highScore}</h2>
      <h2>Score: {score}</h2>

      <div className="grid">
        {gridItems.map((item) => (
          <div
            className={`square ${
              snakePosition.includes(item) ? "snake-body" : ""
            } ${snakePosition[0] === item ? "snake-head" : ""}
            ${applePosition === item ? "apple" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;

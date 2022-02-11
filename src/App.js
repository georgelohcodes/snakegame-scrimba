import "./App.css";
import { useState, useEffect } from "react";

const width = 10;
const squares = [];
for (let i = 0; i < 100; i++) {
  squares.push(i);
}

function App() {
  const [gridItems, setGridItems] = useState(() => squares);
  const [direction, setDirection] = useState(1);
  const [snakePosition, setSnakePosition] = useState([2, 1, 0]);

  const [gameStart, setGameStart] = useState(true);

  useEffect(() => {
    if (gameStart) {
      const interval = setInterval(() => move(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    const dom = document.addEventListener("keydown", changeDirection);
    return () => dom.removeEventListener("keydown", changeDirection);
  }, []);

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
      return true;
    }
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
    }
  }

  // helper functions
  function hasDuplicates(a) {
    const noDups = new Set(a);

    return a.length !== noDups.size;
  }

  return (
    <div className="App">
      <div className="grid">
        {gridItems.map((item) => (
          <div
            className={`square ${
              snakePosition.includes(item) ? "snake-body" : ""
            } ${snakePosition[0] === item ? "snake-head" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;

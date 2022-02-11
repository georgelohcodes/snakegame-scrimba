import "./App.css";
import { useState, useEffect } from "react";

const squares = [];
for (let i = 0; i < 100; i++) {
  squares.push(i);
}

function App() {
  const [gridItems, setGridItems] = useState(() => squares);
  const [direction, setDirection] = useState(1);
  const [snakePosition, setSnakePosition] = useState([2, 1, 0]);

  useEffect(() => {
    const interval = setInterval(() => move(), 1000);
    return () => clearInterval(interval);
  }, []);

  function move() {
    // make copy
    const snakePositionCopy = [...snakePosition];
    // take out last elem from arr
    const tail = snakePositionCopy.pop();
    // add square in direction we are heading
    snakePositionCopy.unshift(snakePosition[0] + direction);
    // change original
    setSnakePosition(snakePositionCopy);
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

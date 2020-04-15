// Importing required packages
import React, { useState, useCallback, useRef } from "react";
import ReactDom from "react-dom";
import { produce } from "immer";
import "./index.css";
import Button from "react-bootstrap/Button";

// Main functional components
function App() {

  // states
  const [rows, setRows] = useState(30);
  const [cols, setCols] = useState(30);
  const [generations, setGenerations] = useState(0);
  const [grid, setGrid] = useState(
    new Array(rows).fill(0).map(() => new Array(cols).fill(0))
  );
  const [running, setRunning] = useState(false);
  
  // using UseRef to track the value
  const rowRef = useRef(rows);
  rowRef.current = rows;
  const refRunning = useRef(running);
  refRunning.current = running;
  const speed = 500;
  const speedRef = useRef(speed);
  
  // the 8 neighbors of a particular cell
  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];

  // Function to run the simulation 
  const runSimulation = useCallback(() => {
    if (!refRunning.current) {
      return;
    }

    // Tracks the current row and columns
    let row = rowRef.current;
    let col = rowRef.current;

    // Set grid according to the game logic
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < col; j++) {
            let neighbors = 0;

            for (let k = 0; k < 8; k++) {
              const [x, y] = operations[k];
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < row && newJ >= 0 && newJ < col) {
                neighbors += g[newI][newJ];
              }
            }

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
        setGenerations((s) => s + 1);
      });
    });

    // Call the function according to given speed
    setTimeout(runSimulation, speedRef.current);
  });

  // function that changes the grid size
  function hand(event) {
    let x = parseInt(event.target.value);
    console.log(x);
    setRows(x);
    setCols(x);
    rowRef.current = x;
    setGrid(new Array(x).fill(0).map(() => new Array(x).fill(0)));
  }

  // Chooses the color of the start or stop button 
  let v = "";
  !running ? (v = "success") : (v = "danger");

  // Renders the element on the screen
  return (
    <>
      <header>Game OF LIFE</header>

      <Button
        variant={v}
        onClick={() => {
          setRunning(!running);
          if (!running) {
            refRunning.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </Button>

      <Button
        variant="primary"
        className="btn"
        onClick={() => {
          setGrid(new Array(rows).fill(0).map(() => new Array(cols).fill(0)));
          setGenerations(0);
        }}
        style={{ margin: 10 }}
      >
        {" "}
        Clear
      </Button>

      <Button
        variant="primary"
        className="btn"
        onClick={() => {
          setGrid(
            new Array(rows)
              .fill(0)
              .map(() =>
                new Array(cols).fill(0).map(() => (Math.random() > 0.5 ? 1 : 0))
              )
          );
        }}
        style={{ margin: 10 }}
      >
        {" "}
        Random
      </Button>

      <Button
        variant="primary"
        className="btn"
        onClick={() => {
          speedRef.current = speedRef.current - 50;
          console.log("Increase: " + speedRef.current);
        }}
        style={{ margin: 10 }}
      >
        {" "}
        Increase speed
      </Button>

      <Button
        variant="primary"
        className="btn"
        onClick={() => {
          speedRef.current = speedRef.current + 50;
          console.log("Decrease: " + speedRef.current);
        }}
        style={{ margin: 10 }}
      >
        {" "}
        Decrease speed
      </Button>

      <label className="gs">Grid size:</label>
      <select onClick={hand}>
        <option value={20}>20*20</option>
        <option value={30}>30*30</option>
        <option value={40}>40*40</option>
        <option value={50}>50*50</option>
      </select>
      <h3>Generations: {generations} </h3>
      <p> 1. Use random to make cell alive randomly.<br/>
          2. You can click on the boxes in the grid to make the cell alive.
      </p>
      <div
        className="box"
        style={{
          backgroundColor: "gray",
          border: "10px solid black",
          width: rows * 20 * 1.5,
          height: rows * 20 * 1.4,
        }}
      >
        <div className="grid" style={{}}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${rows}, 20px)`,
              backgroundColor: "white",

              width: rows * 20 + 10,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((cols, j) => (
                <div
                  key={i + " " + j}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                    });

                    setGrid(newGrid);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: grid[i][j] === 1 ? "blue" : undefined,
                    border: "solid 1px black",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    
    </>
  );
}

ReactDom.render(<App />, document.getElementById("root"));

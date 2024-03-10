import React, { useEffect, useState, useRef } from "react";

import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import Button from "../Button";
import { Cell, CellState, CellValue, Face } from "../../types";

import "./App.scss";
import { MAX_COLS, MAX_ROWS, NUM_OF_BOMBS } from "../../constants";

const App = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NUM_OF_BOMBS);
  const [lose, setLose] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);

  const currentFace = useRef(face);

  useEffect(() => {
    if (face !== Face.oh) currentFace.current = face;
  }, [face]);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.oh);
    };

    const handleMouseUp = (): void => {
      setFace(currentFace.current);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && !lose && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, lose, time]);

  useEffect(() => {
    if (lose) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [lose]);

  useEffect(() => {
    if (win) {
      setLive(false);
      setFace(Face.won);
    }
  }, [win]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();

    // Start the game and make sure that the first click is none
    if (!live) {
      let firstClickNone =
        newCells[rowParam][colParam].value === CellValue.none;
      while (!firstClickNone) {
        newCells = generateCells();
        if (newCells[rowParam][colParam].value === CellValue.none) {
          firstClickNone = true;
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if ([CellState.visible, CellState.flagged].includes(currentCell.state)) {
      return;
    }

    if (lose && currentCell.state === CellState.open) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setLose(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none)
      newCells = openMultipleCells(newCells, rowParam, colParam);
    else newCells[rowParam][colParam].state = CellState.visible;

    let openCells = false;
    for (let row = 0; row < MAX_ROWS; ++row) {
      for (let col = 0; col < MAX_COLS; ++col) {
        const tmpCell = cells[row][col];
        if (
          tmpCell.value !== CellValue.bomb &&
          tmpCell.state === CellState.open
        ) {
          openCells = true;
          break;
        }
      }
    }

    if (!openCells) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }

          return cell;
        })
      );
      setWin(true);
    }

    setCells(newCells);
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      if (!live) return;

      const currentCells = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (currentCell.state === CellState.visible) {
        return;
      } else if (currentCell.state === CellState.open) {
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setBombCounter(bombCounter - 1);
      } else if (currentCell.state === CellState.flagged) {
        currentCells[rowParam][colParam].state = CellState.open;
        setCells(currentCells);
        setBombCounter(bombCounter + 1);
      }
    };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setBombCounter(NUM_OF_BOMBS);
    setLose(false);
    setWin(false);
    setFace(Face.smile);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          red={cell.red}
          onClick={handleCellClick}
          onContext={handleCellContext}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }

        return cell;
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="image" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;

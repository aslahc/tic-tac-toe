/* eslint-disable react/prop-types */

import Cell from "./Cell";

const RenderCells = ({
  x,
  y,
  board,
  currentTurn,
  playerSymbol,
  handleMove,
  winLine,
  gridSize,
}) => {
  const cellContent = board[x][y];
  const cellStyle = {
    width: "100px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid black",
    fontSize: "2em",
    fontWeight: "bold",
    position: "relative",
    cursor: currentTurn === playerSymbol ? "pointer" : "not-allowed",
    backgroundColor: currentTurn === playerSymbol ? "#f0f0f0" : "#e0e0e0",
  };

  if (winLine) {
    const isWinningCell =
      (winLine.type === "row" && winLine.index === x) ||
      (winLine.type === "column" && winLine.index === y) ||
      (winLine.type === "diagonal" && winLine.index === 0 && x === y) ||
      (winLine.type === "diagonal" &&
        winLine.index === 1 &&
        x + y === gridSize - 1);

    if (isWinningCell) {
      cellStyle.backgroundColor = "#90EE90";
    }
  }

  return (
    <Cell
      x={x}
      y={y}
      cellContent={cellContent}
      cellStyle={cellStyle}
      onClick={() => handleMove(x, y)}
    />
  );
};

export default RenderCells;

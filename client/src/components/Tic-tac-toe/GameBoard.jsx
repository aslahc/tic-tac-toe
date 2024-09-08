/* eslint-disable react/prop-types */
import Cell from "./Cell";

const GameBoard = ({
  gridSize,
  board,
  currentTurn,
  playerSymbol,
  handleMove,
  winLine,
}) => {
  const renderCell = (x, y) => {
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
      backgroundColor:
        currentTurn === playerSymbol
          ? "rgba(0, 0, 0, 0)"
          : "rgba(5, 5, 5, 0.05)",
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
        key={`${x}-${y}`}
        x={x}
        y={y}
        cellContent={cellContent}
        cellStyle={cellStyle}
        onClick={() => handleMove(x, y)}
      />
    );
  };

  return (
    <div
      className="game-board"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 100px)`,
        gap: "2px",
        justifyContent: "center",
      }}
    >
      {board.map((row, x) => row.map((_, y) => renderCell(x, y)))}
    </div>
  );
};

export default GameBoard;

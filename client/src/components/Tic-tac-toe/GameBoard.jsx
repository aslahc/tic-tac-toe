/* eslint-disable react/prop-types */

const GameBoard = ({ gridSize, board, renderCell }) => (
  <div
    className="game-board"
    style={{
      gridTemplateColumns: `repeat(${gridSize}, 100px)`,
    }}
  >
    {board.map((row, x) => row.map((_, y) => renderCell(x, y)))}
  </div>
);

export default GameBoard;

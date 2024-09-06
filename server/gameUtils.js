const checkWinner = (board, gridSize) => {
  const lines = [];

  for (let i = 0; i < gridSize; i++) {
    lines.push({ line: board[i], type: "row", index: i });
    lines.push({ line: board.map((row) => row[i]), type: "column", index: i });
  }

  lines.push({
    line: board.map((row, i) => row[i]),
    type: "diagonal",
    index: 0,
  });
  lines.push({
    line: board.map((row, i) => row[gridSize - i - 1]),
    type: "diagonal",
    index: 1,
  });

  for (const { line, type, index } of lines) {
    if (line.every((cell) => cell === "X")) {
      console.log(`Winner found: X on ${type} ${index}`);
      return { winner: "X", winLine: { type, index } };
    }
    if (line.every((cell) => cell === "O")) {
      console.log(`Winner found: O on ${type} ${index}`);
      return { winner: "O", winLine: { type, index } };
    }
  }

  return { winner: null, winLine: null };
};

module.exports = { checkWinner };

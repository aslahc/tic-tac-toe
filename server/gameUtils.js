// Function to check the winner in a Tic-Tac-Toe game based on the current board and grid size
const checkWinner = (board, gridSize) => {
  // Function to check the winner in a Tic-Tac-Toe game based on the current board and grid size
  const lines = [];
  // Function to check the winner in a Tic-Tac-Toe game based on the current board and grid size
  for (let i = 0; i < gridSize; i++) {
    lines.push({ line: board[i], type: "row", index: i });
    lines.push({ line: board.map((row) => row[i]), type: "column", index: i });
  }

  // Add the first diagonal (top-left to bottom-right) to the lines array

  lines.push({
    line: board.map((row, i) => row[i]),
    type: "diagonal",
    index: 0,
  });

  // Add the second diagonal (top-right to bottom-left) to the lines array
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
    // If all cells in the line are "O", O is the winner
    if (line.every((cell) => cell === "O")) {
      console.log(`Winner found: O on ${type} ${index}`);
      return { winner: "O", winLine: { type, index } };
    }
  }
  // Add the second diagonal (top-right to bottom-left) to the lines array
  return { winner: null, winLine: null };
};

module.exports = { checkWinner };

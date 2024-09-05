const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let games = {};

const checkWinner = (board, gridSize) => {
  const lines = [];

  // Check rows and columns
  for (let i = 0; i < gridSize; i++) {
    lines.push({ line: board[i], type: "row", index: i }); // Rows
    lines.push({ line: board.map((row) => row[i]), type: "column", index: i }); // Columns
  }

  // Check diagonals
  lines.push({
    line: board.map((row, i) => row[i]),
    type: "diagonal",
    index: 0,
  }); // Main diagonal
  lines.push({
    line: board.map((row, i) => row[gridSize - i - 1]),
    type: "diagonal",
    index: 1,
  }); // Anti-diagonal

  // Check for a winner
  for (const { line, type, index } of lines) {
    if (line.every((cell) => cell === "X"))
      return { winner: "X", winLine: { type, index } };
    if (line.every((cell) => cell === "O"))
      return { winner: "O", winLine: { type, index } };
  }

  return { winner: null, winLine: null };
};

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // Create a game session
  socket.on("createGame", (data) => {
    const { gridSize, passcode } = data;
    games[passcode] = {
      players: [socket.id],
      gridSize,
      board: Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(null)),
      currentTurn: "X",
      scores: { X: 0, O: 0 },
    };
    socket.join(passcode);
    socket.emit("gameCreated", { passcode });
  });

  // Join a game session
  socket.on("joinGame", (passcode) => {
    console.log("Attempting to join game with passcode:", passcode);
    if (games[passcode] && games[passcode].players.length < 2) {
      games[passcode].players.push(socket.id);
      socket.join(passcode);
      socket.emit("gameJoined", {
        gridSize: games[passcode].gridSize,
        scores: games[passcode].scores,
      });
      io.in(passcode).emit("startGame", games[passcode]);
    } else {
      socket.emit("error", "Game not available");
    }
  });

  // Handle player moves
  socket.on("makeMove", ({ passcode, x, y }) => {
    const game = games[passcode];
    if (
      game &&
      game.board[x][y] === null &&
      socket.id === game.players[game.currentTurn === "X" ? 0 : 1]
    ) {
      game.board[x][y] = game.currentTurn;
      const { winner, winLine } = checkWinner(game.board, game.gridSize);

      if (winner) {
        game.scores[winner] += 1; // Update score
        io.in(passcode).emit("gameOver", {
          winner,
          scores: game.scores,
          winLine,
        });

        // Reset the board for a new round
        game.board = Array(game.gridSize)
          .fill()
          .map(() => Array(game.gridSize).fill(null));
        game.currentTurn = "X";

        // Emit the updated game state
        io.in(passcode).emit("startGame", game);
      } else {
        game.currentTurn = game.currentTurn === "X" ? "O" : "X";
        io.in(passcode).emit("updateBoard", game);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});

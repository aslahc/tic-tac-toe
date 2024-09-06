const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from frontend URL
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

let games = {}; // Store ongoing game sessions

// Function to check the winner for Tic-Tac-Toe
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
    if (line.every((cell) => cell === "X")) {
      console.log(`Winner found: X on ${type} ${index}`);
      return { winner: "X", winLine: { type, index } };
    }
    if (line.every((cell) => cell === "O")) {
      console.log(`Winner found: O on ${type} ${index}`);
      return { winner: "O", winLine: { type, index } };
    }
  }

  return { winner: null, winLine: null }; // No winner yet
};

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id); // Log player connection

  // Handle game creation
  socket.on("createGame", (data) => {
    const { gridSize, passcode } = data;
    console.log(`Creating game with passcode: ${passcode}`);

    // Initialize game session
    games[passcode] = {
      players: [socket.id], // Add first player
      gridSize,
      board: Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(null)), // Empty board
      currentTurn: "X", // X always goes first
      scores: { X: 0, O: 0 }, // Initial scores
    };

    socket.join(passcode); // Join the room based on passcode
    socket.emit("gameCreated", { passcode }); // Inform player that game was created
  });

  // Handle joining an existing game
  socket.on("joinGame", (passcode) => {
    console.log(`Attempting to join game with passcode: ${passcode}`);
    const game = games[passcode];

    // Check if the game exists and if there's space for another player
    if (game && game.players.length < 2) {
      game.players.push(socket.id); // Add the second player
      socket.join(passcode); // Join room

      // Assign symbols to players
      const playerSymbols = {
        [game.players[0]]: "X", // First player is X
        [game.players[1]]: "O", // Second player is O
      };
      game.playerSymbols = playerSymbols; // Save player symbols

      socket.emit("gameJoined", {
        gridSize: game.gridSize,
        scores: game.scores, // Send the game grid size and scores to the second player
      });

      console.log("Both players joined, starting the game.");
      // Notify all players that the game is starting
      io.in(passcode).emit("startGame", game);
    } else {
      socket.emit("error", "Game not available"); // Error if game is full or doesn't exist
    }
  });

  // Handle a player's move
  socket.on("makeMove", ({ pass, x, y }) => {
    const game = games[pass];

    if (!game || game.board[x][y] !== null || game.players.length < 2) return;

    // Update the board
    game.board[x][y] = game.currentTurn;

    // Check for a winner
    const { winner, winLine } = checkWinner(game.board, game.gridSize);

    if (winner) {
      // Update the score and send game over event
      game.scores[winner]++;
      io.in(pass).emit("gameOver", { scores: game.scores, winLine });

      // Delay to reset the board for the next round
      setTimeout(() => {
        // Reset the board
        game.board = Array(game.gridSize)
          .fill()
          .map(() => Array(game.gridSize).fill(null));
        game.currentTurn = "X"; // Reset turn

        // Notify players to start the next round
        io.in(pass).emit("startNextRound", {
          board: game.board,
          currentTurn: game.currentTurn,
        });

        console.log("Starting next round.");
      }, 1000); // 2 seconds delay before starting the next round

      return;
    }

    // Check if the game is a tie (no empty cells)
    if (game.board.every((row) => row.every((cell) => cell !== null))) {
      io.in(pass).emit("gameOver", { scores: game.scores, winLine: null }); // Send tie event
      return;
    }

    // Switch turns
    game.currentTurn = game.currentTurn === "X" ? "O" : "X";

    // Emit the updated board to all players
    io.in(pass).emit("updateBoard", {
      board: game.board,
      currentTurn: game.currentTurn,
    });
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
    // You could add logic here to handle players leaving games if needed
  });
});

// Start the server on port 4000
server.listen(4000, () => {
  console.log("Server running on port 4000");
});

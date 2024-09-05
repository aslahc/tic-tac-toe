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
      socket.emit("gameJoined", { gridSize: games[passcode].gridSize });
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
      game.currentTurn = game.currentTurn === "X" ? "O" : "X";
      io.in(passcode).emit("updateBoard", game);
    }
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});

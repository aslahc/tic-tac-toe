const { checkWinner } = require("./gameUtils");

const games = {};

const gameEvents = (socket, io) => {
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
      history: [], // Initialize history array
    };

    socket.join(passcode);
    socket.emit("gameCreated", { passcode });
  });

  socket.on("joinGame", (passcode) => {
    const game = games[passcode];

    if (game && game.players.length < 2) {
      game.players.push(socket.id);
      socket.join(passcode);

      const playerSymbols = {
        [game.players[0]]: "X",
        [game.players[1]]: "O",
      };
      game.playerSymbols = playerSymbols;

      socket.emit("gameJoined", {
        gridSize: game.gridSize,
        scores: game.scores,
      });

      io.in(passcode).emit("startGame", game);
    } else {
      socket.emit("error", "Game not available");
    }
  });

  socket.on("makeMove", ({ pass, x, y }) => {
    const game = games[pass];

    if (!game || game.board[x][y] !== null || game.players.length < 2) return;

    // Record the move in history
    game.history.push({ player: game.currentTurn, x, y });

    game.board[x][y] = game.currentTurn;

    const { winner, winLine } = checkWinner(game.board, game.gridSize);
    game.currentTurn = game.currentTurn === "X" ? "O" : "X";

    io.in(pass).emit("updateBoard", {
      board: game.board,
      currentTurn: game.currentTurn,
      history: game.history, // Send updated history
    });
    if (winner) {
      game.scores[winner]++;
      io.in(pass).emit("gameOver", { scores: game.scores, winLine });

      setTimeout(() => {
        game.board = Array(game.gridSize)
          .fill()
          .map(() => Array(game.gridSize).fill(null));
        game.currentTurn = "X";
        game.history = []; // Reset history

        io.in(pass).emit("startNextRound", {
          board: game.board,
          currentTurn: game.currentTurn,
        });
      }, 1000);

      return;
    }

    const isDraw = game.board.every((row) =>
      row.every((cell) => cell !== null)
    );

    if (isDraw) {
      io.in(pass).emit("gameOver", { scores: game.scores, winLine: null });

      game.board = Array(game.gridSize)
        .fill()
        .map(() => Array(game.gridSize).fill(null));
      game.currentTurn = "X";
      game.history = []; // Reset history

      io.in(pass).emit("startNextRound", {
        board: game.board,
        currentTurn: game.currentTurn,
      });

      return;
    }
  });

  socket.on("cancelGame", (passcode) => {
    const game = games[passcode];
    if (game) {
      io.in(passcode).emit("gameCancelled", "The game has been cancelled.");
      io.in(passcode).socketsLeave(passcode);
      delete games[passcode];
    }
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
  });
};

module.exports = gameEvents;

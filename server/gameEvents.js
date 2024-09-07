const { checkWinner } = require("./gameUtils");

const games = {};

const gameEvents = (socket, io) => {
  socket.on("createGame", (data) => {
    const { gridSize, passcode } = data;
    console.log(`Creating game with passcode: ${passcode}`);

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

  socket.on("joinGame", (passcode) => {
    console.log(`Attempting to join game with passcode: ${passcode}`);
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

      console.log("Both players joined, starting the game.");
      io.in(passcode).emit("startGame", game);
    } else {
      socket.emit("error", "Game not available");
    }
  });

  socket.on("makeMove", ({ pass, x, y }) => {
    const game = games[pass];

    if (!game || game.board[x][y] !== null || game.players.length < 2) return;

    game.board[x][y] = game.currentTurn;

    const { winner, winLine } = checkWinner(game.board, game.gridSize);

    if (winner) {
      game.scores[winner]++;
      io.in(pass).emit("gameOver", { scores: game.scores, winLine });

      // Reset the board and start the next round after a short delay
      setTimeout(() => {
        game.board = Array(game.gridSize)
          .fill()
          .map(() => Array(game.gridSize).fill(null));
        game.currentTurn = "X";

        io.in(pass).emit("startNextRound", {
          board: game.board,
          currentTurn: game.currentTurn,
        });

        console.log("Starting next round.");
      }, 1000);

      return;
    }

    // Handle draw case: no winner and board is full
    const isDraw = game.board.every((row) =>
      row.every((cell) => cell !== null)
    );

    if (isDraw) {
      io.in(pass).emit("gameOver", { scores: game.scores, winLine: null });

      // Reset the board and start next round immediately (no score update)
      game.board = Array(game.gridSize)
        .fill()
        .map(() => Array(game.gridSize).fill(null));
      game.currentTurn = "X";

      io.in(pass).emit("startNextRound", {
        board: game.board,
        currentTurn: game.currentTurn,
      });

      console.log("Starting next round immediately after draw.");

      return;
    }

    // Continue the game if no draw or winner
    game.currentTurn = game.currentTurn === "X" ? "O" : "X";

    io.in(pass).emit("updateBoard", {
      board: game.board,
      currentTurn: game.currentTurn,
    });
  });
  socket.on("cancelGame", (passcode) => {
    console.log("eter");
    console.log("Handling cancellation...");
    const game = games[passcode];

    if (game) {
      // Notify all users in the room that the game is being cancelled
      io.in(passcode).emit("gameCancelled", "The game has been cancelled.");

      // Remove all players from the room
      io.in(passcode).socketsLeave(passcode);

      // Delete the game from the server
      delete games[passcode];

      console.log(`Game with passcode: ${passcode} has been cancelled.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
  });
};

module.exports = gameEvents;

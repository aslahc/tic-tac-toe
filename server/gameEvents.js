const { checkWinner } = require("./gameUtils");
// Object to store ongoing games, with the passcode as the key
const games = {};

// Function to handle game-related socket events
const gameEvents = (socket, io) => {
  // Event handler for creating a new game
  socket.on("createGame", (data) => {
    const { gridSize, passcode } = data; // Extract gridSize and passcode from the data sent by the client
    // Initialize the new game in the games object with the provided passcode
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
    // Add the player to the room using the passcode
    socket.join(passcode);
    // Notify the player that the game has been created
    socket.emit("gameCreated", { passcode });
  });
  // Event handler for joining an existing game
  socket.on("joinGame", (passcode) => {
    const game = games[passcode];
    // Check if the game exists and has only one player (waiting for another)
    if (game && game.players.length < 2) {
      game.players.push(socket.id);
      socket.join(passcode);
      // Notify the player that they successfully joined the game
      const playerSymbols = {
        [game.players[0]]: "X",
        [game.players[1]]: "O",
      };
      game.playerSymbols = playerSymbols;

      socket.emit("gameJoined", {
        gridSize: game.gridSize,
        scores: game.scores,
      });
      // Start the game and notify all players in the room
      io.in(passcode).emit("startGame", game);
    } else {
      // If the game is full or doesn't exist, send an error
      socket.emit("error", "Game not available");
    }
  });

  socket.on("makeMove", ({ pass, x, y }) => {
    // Event handler for making a move
    const game = games[pass];
    // Validate the move: check if the game exists, the move is on an empty spot, and there are 2 players
    if (!game || game.board[x][y] !== null || game.players.length < 2) return;

    // Record the move in history
    game.history.push({ player: game.currentTurn, x, y });
    // Update the board with the current player's move
    game.board[x][y] = game.currentTurn;
    // Check if there is a winner after the move
    const { winner, winLine } = checkWinner(game.board, game.gridSize);
    game.currentTurn = game.currentTurn === "X" ? "O" : "X";
    // Emit the updated board and the current turn to all players in the room
    io.in(pass).emit("updateBoard", {
      board: game.board,
      currentTurn: game.currentTurn,
      history: game.history, // Send updated history
    });

    // If a winner is found
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
    // Check if the game is a draw (i.e., no empty cells left on the board)
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

  // Event handler to cancel a game

  socket.on("cancelGame", (passcode) => {
    const game = games[passcode];
    if (game) {
      io.in(passcode).emit("gameCancelled", "The game has been cancelled.");
      io.in(passcode).socketsLeave(passcode);
      delete games[passcode];
    }
  });
  // Event handler for player disconnection
  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
  });
};

module.exports = gameEvents;

import io from "socket.io-client";

const BACKEND_URL = "https://tic-tac-toe-backend-fawn.vercel.app";

const socket = io(BACKEND_URL);

export const initializeSocket = (callbacks) => {
  const {
    onGameCreated,
    onGameJoined,
    onStartGame,
    onUpdateBoard,
    onStartNextRound,
    onGameOver,
    onError,
    onGameCancelled,
  } = callbacks;

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("connect_error", (error) => {
    console.log("Connection error:", error);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("gameCreated", onGameCreated);
  socket.on("gameJoined", onGameJoined);
  socket.on("startGame", onStartGame);
  socket.on("updateBoard", onUpdateBoard);
  socket.on("startNextRound", onStartNextRound);
  socket.on("gameOver", onGameOver);
  socket.on("error", onError);
  socket.on("gameCancelled", onGameCancelled);

  return () => {
    socket.off("gameCreated", onGameCreated);
    socket.off("gameJoined", onGameJoined);
    socket.off("startGame", onStartGame);
    socket.off("updateBoard", onUpdateBoard);
    socket.off("startNextRound", onStartNextRound);
    socket.off("gameOver", onGameOver);
    socket.off("error", onError);
    socket.off("gameCancelled", onGameCancelled);
  };
};

// Rest of your code remains the same
export const createGame = (gridSize, passcode) => {
  socket.emit("createGame", { gridSize, passcode });
};

export const joinGame = (passcode) => {
  socket.emit("joinGame", passcode);
};

export const makeMove = (pass, x, y) => {
  socket.emit("makeMove", { pass, x, y });
};

export const cancelGame = (passcode) => {
  socket.emit("cancelGame", passcode);
};

export default socket;

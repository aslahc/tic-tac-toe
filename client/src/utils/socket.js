import io from "socket.io-client";

const socket = io("https://tic-tac-toe-fpvz.onrender.com/");

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

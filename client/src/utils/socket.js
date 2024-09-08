import io from "socket.io-client";

// Initialize the socket connection to the provided server URL
const socket = io("https://tic-tac-toe-fpvz.onrender.com/");
// Function to initialize socket event listeners and their corresponding callback functions
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
  // Set up event listeners for each event emitted from the server
  socket.on("gameCreated", onGameCreated);
  socket.on("gameJoined", onGameJoined);
  socket.on("startGame", onStartGame);
  socket.on("updateBoard", onUpdateBoard);
  socket.on("startNextRound", onStartNextRound);
  socket.on("gameOver", onGameOver);
  socket.on("error", onError);
  socket.on("gameCancelled", onGameCancelled);
  // Return a function to clean up the event listeners when no longer needed
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

// Function to emit the 'makeMove' event to the server, passing the game passcode and coordinates (x, y) of the mov
export const joinGame = (passcode) => {
  socket.emit("joinGame", passcode);
};
// Function to emit the 'makeMove' event to the server, passing the game passcode and coordinates (x, y)
export const makeMove = (pass, x, y) => {
  socket.emit("makeMove", { pass, x, y });
};
// Function to emit the 'cancelGame' event to the server, passing the game's passcode to cancel the game
export const cancelGame = (passcode) => {
  socket.emit("cancelGame", passcode);
};

export default socket;

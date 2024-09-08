import { useState, useEffect, useCallback } from "react";
import {
  initializeSocket,
  createGame as createGameSocket,
  joinGame as joinGameSocket,
  makeMove as makeMoveSocket,
  cancelGame as cancelGameSocket,
} from "../utils/socket.js";

export const useTicTacToe = () => {
  // State variables to manage game status, board, and player info
  const [passcode, setPasscode] = useState("");
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [gridSize, setGridSize] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [error, setError] = useState("");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winLine, setWinLine] = useState(null);
  const [history, setHistory] = useState([]);
  // Function to handle making a move on the board
  const handleMove = useCallback(
    (x, y) => {
      if (board[x][y] || winLine || currentTurn !== playerSymbol) {
        return;
      }
      let pass = passcode || enteredPasscode;
      makeMoveSocket(pass, x, y);
    },
    [board, winLine, currentTurn, playerSymbol, passcode, enteredPasscode]
  );
  // Function to handle game cancellation
  const handleCancel = useCallback(() => {
    console.log("entering to handle cancel ");
    setGameStarted(false);
    setBoard([]);
    setPasscode("");
    setEnteredPasscode("");
    setPlayerSymbol(null);
    setCurrentTurn("X");
    setGridSize(3);
    const storedPasscode = localStorage.getItem("gamePasscode");
    console.log("stored passcode ", storedPasscode);
    cancelGameSocket(storedPasscode);
  }, []);
  // Setup socket event listeners and cleanup when the component is unmounted
  useEffect(() => {
    const cleanup = initializeSocket({
      onGameCreated: ({ passcode }) => {
        setPasscode(passcode);
        setPlayerSymbol("X");
      },
      onGameJoined: ({ gridSize, scores }) => {
        setGridSize(gridSize);
        setGameStarted(true);
        setBoard(
          Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
        );
        setScores(scores);
        setPlayerSymbol("O");
      },
      onStartGame: (game) => {
        console.log("game", game);
        setBoard(game.board);
        setCurrentTurn(game.currentTurn);
        setGameStarted(true);
        setScores(game.scores);
        setWinLine(null);
      },
      onUpdateBoard: (game) => {
        console.log("update fff", game);
        setBoard(game.board);
        setCurrentTurn(game.currentTurn);
        setHistory(game.history);
      },
      onStartNextRound: ({ board, currentTurn }) => {
        setBoard(board);
        setCurrentTurn(currentTurn);
        setWinLine(null);
      },
      onGameOver: ({ scores, winLine }) => {
        setScores(scores);
        setWinLine(winLine);
      },
      onError: (message) => {
        setError(message);
      },
      onGameCancelled: () => {
        handleCancel();
      },
    });

    return cleanup;
  }, [handleCancel]);
  // Function to create a new game
  const createGame = useCallback(() => {
    if (gridSize < 3 || gridSize > 10) {
      setError("Grid size should be between 3 and 10.");
      return;
    }
    const newPasscode = Math.random().toString(36).substring(7);
    localStorage.setItem("gamePasscode", newPasscode);

    createGameSocket(gridSize, newPasscode);
    setPasscode(newPasscode);
  }, [gridSize]);
  // Function to join an existing game
  const joinGame = useCallback(() => {
    if (!enteredPasscode) {
      setError("Please enter a valid passcode.");
      return;
    }
    joinGameSocket(enteredPasscode);
  }, [enteredPasscode]);

  return {
    passcode,
    setPasscode,
    enteredPasscode,
    setEnteredPasscode,
    gridSize,
    setGridSize,
    gameStarted,
    board,
    currentTurn,
    playerSymbol,
    error,
    scores,
    winLine,
    handleMove,
    createGame,
    joinGame,
    handleCancel,
    setGameStarted,
    history,
  };
};

import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const useTicTacToe = () => {
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

  const handleMove = useCallback(
    (x, y) => {
      if (board[x][y] || winLine || currentTurn !== playerSymbol) {
        return;
      }
      let pass = passcode || enteredPasscode;
      socket.emit("makeMove", { pass, x, y });
    },
    [board, winLine, currentTurn, playerSymbol, passcode, enteredPasscode]
  );
  const handleCancel = useCallback(() => {
    setGameStarted(false);
    if (passcode) {
      setPasscode(null); // Reset passcode locally
      socket.emit("cancelGame", passcode); // Emit cancel event to server
    }
  }, [passcode]);

  useEffect(() => {
    const handleGameCreated = ({ passcode }) => {
      setPasscode(passcode);
      setPlayerSymbol("X");
    };

    const handleGameJoined = ({ gridSize, scores }) => {
      setGridSize(gridSize);
      setGameStarted(true);
      setBoard(
        Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
      );
      setScores(scores);
      setPlayerSymbol("O");
    };

    const handleStartGame = (game) => {
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
      setGameStarted(true);
      setScores(game.scores);
      setWinLine(null);
    };

    const handleUpdateBoard = (game) => {
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
    };

    const handleStartNextRound = ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
      setWinLine(null);
    };

    const handleGameOver = ({ scores, winLine }) => {
      setScores(scores);
      setWinLine(winLine);
    };

    const handleError = (message) => {
      setError(message);
    };

    socket.on("gameCreated", handleGameCreated);
    socket.on("gameJoined", handleGameJoined);
    socket.on("startGame", handleStartGame);
    socket.on("updateBoard", handleUpdateBoard);
    socket.on("startNextRound", handleStartNextRound);
    socket.on("gameOver", handleGameOver);
    socket.on("error", handleError);

    return () => {
      socket.off("gameCreated", handleGameCreated);
      socket.off("gameJoined", handleGameJoined);
      socket.off("startGame", handleStartGame);
      socket.off("updateBoard", handleUpdateBoard);
      socket.off("startNextRound", handleStartNextRound);
      socket.off("gameOver", handleGameOver);
      socket.off("error", handleError);
    };
  }, []);

  const createGame = useCallback(() => {
    if (gridSize < 3 || gridSize > 10) {
      setError("Grid size should be between 3 and 10.");
      return;
    }
    const newPasscode = Math.random().toString(36).substring(7);

    socket.emit("createGame", { gridSize, passcode: newPasscode });
    setPasscode(newPasscode);
  }, [gridSize]);

  const joinGame = useCallback(() => {
    if (!enteredPasscode) {
      setError("Please enter a valid passcode.");
      return;
    }
    socket.emit("joinGame", enteredPasscode);
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
  };
};

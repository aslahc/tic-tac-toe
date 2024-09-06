import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const App = () => {
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

  const handleMove = (x, y) => {
    if (board[x][y] || winLine || currentTurn !== playerSymbol) {
      console.log("Invalid move: Cell filled, game over, or not your turn");
      return;
    }
    console.log(`Move made by ${currentTurn} at position: (${x}, ${y})`);
    let pass = passcode || enteredPasscode;
    socket.emit("makeMove", { pass, x, y });
  };

  useEffect(() => {
    socket.on("gameCreated", ({ passcode }) => {
      console.log("Game Created, passcode:", passcode);
      setPasscode(passcode);
      setPlayerSymbol("X");
    });

    socket.on("gameJoined", ({ gridSize, scores }) => {
      console.log("Game Joined, gridSize:", gridSize, "scores:", scores);
      setGridSize(gridSize);
      setGameStarted(true);
      setBoard(
        Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
      );
      setScores(scores);
      setPlayerSymbol("O");
    });

    socket.on("startGame", (game) => {
      console.log("Game started:", game);
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
      setGameStarted(true);
      setScores(game.scores);
      setWinLine(null);
    });

    socket.on("updateBoard", (game) => {
      console.log("Board updated:", game);
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
    });
    socket.on("startNextRound", ({ board, currentTurn }) => {
      console.log("Starting next round.");
      setBoard(board);
      setCurrentTurn(currentTurn);
      setWinLine(null);
    });

    socket.on("gameOver", ({ scores, winLine }) => {
      console.log("Game over, scores:", scores, "winLine:", winLine);
      setScores(scores);
      setWinLine(winLine);
    });

    socket.on("error", (message) => {
      console.log("Error received:", message);
      setError(message);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("gameJoined");
      socket.off("startGame");
      socket.off("updateBoard");
      socket.off("gameOver");
      socket.off("error");
    };
  }, []);

  const createGame = () => {
    if (gridSize < 3 || gridSize > 10) {
      setError("Grid size should be between 3 and 10.");
      return;
    }
    const newPasscode = Math.random().toString(36).substring(7);
    console.log(
      "Creating game with grid size:",
      gridSize,
      "passcode:",
      newPasscode
    );
    socket.emit("createGame", { gridSize, passcode: newPasscode });
    setPasscode(newPasscode);
  };

  const joinGame = () => {
    if (!enteredPasscode) {
      setError("Please enter a valid passcode.");
      return;
    }
    console.log("Joining game with passcode:", enteredPasscode);
    socket.emit("joinGame", enteredPasscode);
  };

  const renderCell = (x, y) => {
    const cellContent = board[x][y];
    let cellStyle = {
      width: "100px",
      height: "100px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid black",
      fontSize: "2em",
      fontWeight: "bold",
      position: "relative",
      cursor: currentTurn === playerSymbol ? "pointer" : "not-allowed",
      backgroundColor: currentTurn === playerSymbol ? "#f0f0f0" : "#e0e0e0",
    };

    let crossStyle = {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "none",
    };

    if (winLine) {
      if (
        (winLine.type === "row" && winLine.index === x) ||
        (winLine.type === "column" && winLine.index === y) ||
        (winLine.type === "diagonal" && winLine.index === 0 && x === y) ||
        (winLine.type === "diagonal" &&
          winLine.index === 1 &&
          x + y === gridSize - 1)
      ) {
        crossStyle.display = "block";
        if (winLine.type === "row") {
          crossStyle.borderBottom = "5px solid red";
        } else if (winLine.type === "column") {
          crossStyle.borderRight = "5px solid red";
        } else if (winLine.type === "diagonal") {
          if (winLine.index === 0) {
            crossStyle.transform = "rotate(45deg)";
            crossStyle.borderBottom = "5px solid red";
          } else {
            crossStyle.transform = "rotate(-45deg)";
            crossStyle.borderBottom = "5px solid red";
          }
        }
      }
    }

    return (
      <div key={`${x}-${y}`} onClick={() => handleMove(x, y)} style={cellStyle}>
        {cellContent}
        <div style={crossStyle}></div>
      </div>
    );
  };

  return (
    <div
      className="App"
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div className="min-h-screen bg-lined-paper font-handwriting">
        <h1 className="text-4xl mb-6 text-center justify-center">
          Tic-Tac-Toe
        </h1>
        {!gameStarted ? (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              className="px-4 py-2 m-2 bg-gray-900 rounded-full text-yellow-50 font-bold hover:bg-gray-700"
              onClick={createGame}
            >
              Create Game
            </button>
            {passcode && <p>Passcode: {passcode}</p>}
            <br />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
              type="text"
              className="rounded-full bg-transparent border-2 border-black"
              placeholder="Enter passcode"
              style={{ padding: "10px", margin: "10px" }}
              onChange={(e) => setEnteredPasscode(e.target.value)}
            />
            <button
              className="px-4 py-2 m-2 bg-gray-900 rounded-full text-yellow-50 font-bold hover:bg-gray-700"
              onClick={joinGame}
            >
              Join Game
            </button>
            <div style={{ marginTop: "20px" }}>
              <label>Grid Size: </label>
              <input
                type="number"
                className="rounded-full bg-transparent border-2 max-w-12 p-2 border-black"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                placeholder="Grid Size"
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h2>Tic Tac Toe</h2>
            <p>
              {currentTurn === playerSymbol ? (
                <span>Your Turn: {playerSymbol}</span>
              ) : (
                <span>Opponent Turn: {currentTurn}</span>
              )}
            </p>
            <p style={{ marginBottom: "20px" }}>
              <span>Score - X: </span>
              <span className="text-blue-500">{scores.X}</span>
              <span>, O: </span>
              <span className="text-red-600">{scores.O}</span>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, 100px)`,
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {board.map((row, x) => row.map((_, y) => renderCell(x, y)))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

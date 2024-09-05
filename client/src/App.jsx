import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const App = () => {
  const [passcode, setPasscode] = useState("");
  const [gridSize, setGridSize] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [error, setError] = useState("");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winLine, setWinLine] = useState(null);

  useEffect(() => {
    socket.on("gameCreated", ({ passcode }) => {
      setPasscode(passcode);
    });

    socket.on("gameJoined", ({ gridSize, scores }) => {
      setGridSize(gridSize);
      setGameStarted(true);
      setBoard(Array(gridSize).fill(Array(gridSize).fill(null)));
      setScores(scores);
    });

    socket.on("startGame", (game) => {
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
      setGameStarted(true);
      setScores(game.scores);
      setWinLine(null);
    });

    socket.on("updateBoard", (game) => {
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
    });

    socket.on("gameOver", ({ scores, winLine }) => {
      setScores(scores);
      setWinLine(winLine);
      // Remove the alert here
    });
  }, []);

  const createGame = () => {
    if (gridSize < 3 || gridSize > 10) {
      setError("Grid size should be between 3 and 10.");
      return;
    }

    const passcode = Math.random().toString(36).substring(7);
    socket.emit("createGame", { gridSize, passcode });
  };

  const joinGame = () => {
    if (!passcode) {
      setError("Please enter a valid passcode.");
      return;
    }

    socket.emit("joinGame", passcode);

    socket.on("error", (errorMessage) => {
      setError(errorMessage);
    });
  };

  const handleMove = (x, y) => {
    if (!board[x][y] && !winLine) {
      socket.emit("makeMove", { passcode, x, y });
    }
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
    <div className="App">
      {!gameStarted ? (
        <div>
          <button onClick={createGame}>Create Game</button>
          <p>Passcode: {passcode}</p>
          <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>

          <input
            type="text"
            placeholder="Enter passcode"
            onChange={(e) => setPasscode(e.target.value)}
          />
          <button onClick={joinGame}>Join Game</button>
          <div>
            <label>Grid Size: </label>
            <input
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
            />
          </div>
        </div>
      ) : (
        <div>
          <h2>Tic Tac Toe - {currentTurn} Turn</h2>
          <div>
            <p>
              Score - X: {scores.X}, O: {scores.O}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 100px)`,
            }}
          >
            {board.map((row, x) => row.map((_, y) => renderCell(x, y)))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

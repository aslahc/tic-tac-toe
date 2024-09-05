import { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:4000");

const App = () => {
  const [passcode, setPasscode] = useState("");
  const [gridSize, setGridSize] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("X");

  useEffect(() => {
    socket.on("gameCreated", ({ passcode }) => {
      setPasscode(passcode);
    });

    socket.on("gameJoined", ({ gridSize }) => {
      setGridSize(gridSize);
      setGameStarted(true);
      setBoard(Array(gridSize).fill(Array(gridSize).fill(null)));
    });

    socket.on("startGame", (game) => {
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
      setGameStarted(true);
    });

    socket.on("updateBoard", (game) => {
      setBoard(game.board);
      setCurrentTurn(game.currentTurn);
    });
  }, []);

  const createGame = () => {
    const passcode = Math.random().toString(36).substring(7);
    console.log(passcode);
    socket.emit("createGame", { gridSize, passcode });
  };

  const joinGame = () => {
    console.log("gmae jpind ", passcode);
    socket.emit("joinGame", passcode);
  };

  const handleMove = (x, y) => {
    if (!board[x][y]) {
      socket.emit("makeMove", { passcode, x, y });
    }
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <div>
          <button onClick={createGame}>Create Game</button>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 100px)`,
            }}
          >
            {board.map((row, x) =>
              row.map((cell, y) => (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleMove(x, y)}
                  style={{
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid black",
                  }}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

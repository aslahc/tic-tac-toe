import { useState } from "react";
import { useTicTacToe } from "./hooks/useTicTacToe";
import GameSetup from "./components/Tic-tac-toe/GameSetup";
import Cell from "./components/Tic-tac-toe/Cell";
import GameInfo from "./components/Tic-tac-toe/GameInfo";
import GameBoard from "./components/Tic-tac-toe/GameBoard";
const App = () => {
  const {
    passcode,
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
    setGameStarted,
  } = useTicTacToe();

  const [isWaiting, setIsWaiting] = useState(false);

  const renderCell = (x, y) => {
    const cellContent = board[x][y];
    // const cellStyle = {
    //   width: "100px",
    //   height: "100px",
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   border: "1px solid black",
    //   fontSize: "2em",
    //   fontWeight: "bold",
    //   position: "relative",
    //   cursor: currentTurn === playerSymbol ? "pointer" : "not-allowed",
    //   backgroundColor: currentTurn === playerSymbol ? "#f0f0f0" : "#e0e0e0",
    //   "@media (max-width: 768px)": {
    //     width: "80px",
    //     height: "80px",
    //     fontSize: "1.5em",
    //   },
    //   "@media (max-width: 480px)": {
    //     width: "60px",
    //     height: "60px",
    //     fontSize: "1em",
    //   },
    // };

    if (winLine) {
      const isWinningCell =
        (winLine.type === "row" && winLine.index === x) ||
        (winLine.type === "column" && winLine.index === y) ||
        (winLine.type === "diagonal" && winLine.index === 0 && x === y) ||
        (winLine.type === "diagonal" &&
          winLine.index === 1 &&
          x + y === gridSize - 1);

      if (isWinningCell) {
        // cellStyle.backgroundColor = "#90EE90";
      }
    }

    return (
      <Cell
        x={x}
        y={y}
        cellContent={cellContent}
        // cellStyle={cellStyle}
        onClick={() => handleMove(x, y)}
      />
    );
  };

  return (
    <div className="App flex flex-col items-center justify-center min-h-screen">
      <div className="min-h-screen w-full px-4 sm:px-8 bg-lined-paper font-handwriting">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl mb-6 text-center">
          Tic-Tac-Toe
        </h1>

        {!gameStarted ? (
          <GameSetup
            isWaiting={isWaiting}
            setIsWaiting={setIsWaiting}
            passcode={passcode}
            error={error}
            setEnteredPasscode={setEnteredPasscode}
            gridSize={gridSize}
            setGridSize={setGridSize}
            createGame={createGame}
            joinGame={joinGame}
          />
        ) : (
          <div className="text-center">
            <GameInfo
              currentTurn={currentTurn}
              playerSymbol={playerSymbol}
              scores={scores}
            />
            <button
              className="mt-4 px-6 py-2 text-red-600 transition-all duration-200"
              onClick={() => {
                setGameStarted(false);
              }}
            >
              Exit Game
            </button>
            <GameBoard
              gridSize={gridSize}
              board={board}
              renderCell={renderCell}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

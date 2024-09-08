import { useState } from "react";
import { useTicTacToe } from "./hooks/useTicTacToe";
import GameSetup from "./components/Tic-tac-toe/GameSetup";
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
    history,
    handleCancel,
  } = useTicTacToe();

  const [isWaiting, setIsWaiting] = useState(false);
  const handleExitgame = () => {
    console.log("enter to handle exit game ");
    handleCancel();
    setGameStarted(false);
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
          <>
            <div className="text-center">
              <GameInfo
                currentTurn={currentTurn}
                playerSymbol={playerSymbol}
                scores={scores}
              />
              <button
                className="mt-4 px-6 py-2 text-red-600 transition-all duration-200"
                onClick={() => {
                  handleExitgame();
                }}
              >
                Exit Game
              </button>
              <GameBoard
                gridSize={gridSize}
                board={board}
                currentTurn={currentTurn}
                playerSymbol={playerSymbol}
                handleMove={handleMove}
                winLine={winLine}
              />
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-bold">Move History:</h2>
              <ul>
                {history.map((move, index) => (
                  <li key={index}>
                    Player {move.player} moved to ({move.x}, {move.y})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

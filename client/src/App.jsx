import { useTicTacToe } from "./hooks/useTicTacToe";
import GameSetup from "./components/GameSetup";
import Cell from "./components/Cell";
import GameInfo from "./components/GameInfo";
import GameBoard from "./components/GameBoard";
const App = () => {
  const {
    passcode,
    // setPasscode,
    // enteredPasscode,
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
  } = useTicTacToe();

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
      <Cell
        x={x}
        y={y}
        cellContent={cellContent}
        cellStyle={cellStyle}
        crossStyle={crossStyle}
        onClick={() => handleMove(x, y)}
      />
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
          <GameSetup
            passcode={passcode}
            error={error}
            setEnteredPasscode={setEnteredPasscode}
            gridSize={gridSize}
            setGridSize={setGridSize}
            createGame={createGame}
            joinGame={joinGame}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <GameInfo
              currentTurn={currentTurn}
              playerSymbol={playerSymbol}
              scores={scores}
            />
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

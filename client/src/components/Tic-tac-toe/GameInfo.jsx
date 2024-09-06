/* eslint-disable react/prop-types */
import { useTicTacToe } from "../../hooks/useTicTacToe";

const GameInfo = ({ currentTurn, playerSymbol, scores }) => {
  const { handleCancel, setGameStarted } = useTicTacToe();
  const makecancel = () => {
    handleCancel(); // Call the function to invalidate the passcode
    setGameStarted(false); // Reset game start state if needed
  };
  return (
    <div className="relative">
      <button
        onClick={makecancel} // Updated to use the function reference correctly
        className="font-bold p-2 text-red-600 rounded"
      >
        Cancel
      </button>

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
    </div>
  );
};

export default GameInfo;

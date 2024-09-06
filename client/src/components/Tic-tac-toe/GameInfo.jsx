/* eslint-disable react/prop-types */

const GameInfo = ({ currentTurn, playerSymbol, scores }) => (
  <div>
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
  </div>
);
export default GameInfo;

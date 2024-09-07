/* eslint-disable react/prop-types */
const GameInfo = ({ currentTurn, playerSymbol, scores }) => {
  return (
    <div className="relative p-4 md:p-6 lg:p-8">
      <p className="text-base md:text-lg lg:text-xl font-semibold">
        {currentTurn === playerSymbol ? (
          <span>Your Turn: {playerSymbol}</span>
        ) : (
          <span>Opponent Turn: {currentTurn}</span>
        )}
      </p>
      <p className="text-base md:text-lg lg:text-xl mt-4">
        <span>Score - X: </span>
        <span className="text-blue-500">{scores.X}</span>
        <span>, O: </span>
        <span className="text-red-600">{scores.O}</span>
      </p>
    </div>
  );
};

export default GameInfo;

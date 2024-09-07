import React from "react";

const MoveHistory = ({ history }) => (
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
);

export default MoveHistory;

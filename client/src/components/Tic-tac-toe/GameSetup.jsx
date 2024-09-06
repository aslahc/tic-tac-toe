/* eslint-disable react/prop-types */
import { useState } from "react";
import Btn from "../Buttons/Btn";
import { useTicTacToe } from "../../hooks/useTicTacToe";
const GameSetup = ({
  passcode,
  error,
  setEnteredPasscode,
  gridSize,
  setGridSize,
  createGame,
  joinGame,
  isWaiting,
  setIsWaiting,

  // New prop for invalidating the passcode
}) => {
  const [copySuccess, setCopySuccess] = useState("");
  const { handleCancel } = useTicTacToe();
  // Function to copy passcode to clipboard
  const handleCopy = () => {
    if (passcode) {
      navigator.clipboard.writeText(passcode);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
    }
  };

  const handleCreateGame = () => {
    createGame();
    setIsWaiting(true);
  };

  // New function to handle cancellation
  const makecancel = () => {
    handleCancel(); // Call the function to invalidate the passcode
    setIsWaiting(false);
  };

  return (
    <div className="text-center mb-5">
      <Btn onClick={handleCreateGame} text="Create Game" />
      <br />
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        className="rounded-full bg-transparent border-2 border-black p-2 m-2"
        placeholder="Enter passcode"
        onChange={(e) => setEnteredPasscode(e.target.value)}
      />
      <Btn onClick={joinGame} text="Join Game" />
      <div className="mt-5">
        <label>Grid Size: </label>
        <input
          type="number"
          className="rounded-full bg-transparent border-2 max-w-12 p-2 border-black"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          placeholder="Grid Size"
        />
      </div>

      {isWaiting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Waiting for Opponent</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p>Waiting for an opponent to join...</p>
              <div className="flex items-center space-x-2">
                <p>Passcode: {passcode}</p>
                <button
                  onClick={handleCopy}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  Copy
                </button>
                {copySuccess && (
                  <span className="text-green-500">{copySuccess}</span>
                )}
              </div>
            </div>
            <button
              onClick={makecancel}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSetup;

/* eslint-disable react/prop-types */
import Btn from "../Buttons/Btn";
import { useTicTacToe } from "../../hooks/useTicTacToe";
import OpponentWaiting from "../popupModal/OpponentWaiting";
import { useClipboard } from "../../hooks/handlecopy";
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
  const { handleCancel } = useTicTacToe();
  // Function to copy passcode to clipboard
  const { handleCopy, copySuccess } = useClipboard();

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
        <OpponentWaiting
          passcode={passcode}
          copySuccess={copySuccess}
          handleCopy={handleCopy}
          makecancel={makecancel}
        />
      )}
    </div>
  );
};

export default GameSetup;

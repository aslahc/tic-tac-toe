/* eslint-disable react/prop-types */
import { useState } from "react";
import Btn from "../Buttons/Btn";

const GameSetup = ({
  passcode,
  error,
  setEnteredPasscode,
  gridSize,
  setGridSize,
  createGame,
  joinGame,
}) => {
  const [copySuccess, setCopySuccess] = useState("");

  // Function to copy passcode to clipboard
  const handleCopy = () => {
    if (passcode) {
      navigator.clipboard.writeText(passcode);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
    }
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <Btn onClick={createGame} text="Create Game" />
      {passcode && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ marginRight: "10px" }}>Passcode: {passcode}</p>
          <button
            onClick={handleCopy}
            style={{
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "16px",
              color: "blue",
              marginLeft: "5px",
            }}
          >
            Copy
          </button>
          {copySuccess && (
            <span style={{ marginLeft: "10px", color: "green" }}>
              {copySuccess}
            </span>
          )}
        </div>
      )}
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        className="rounded-full bg-transparent border-2 border-black"
        placeholder="Enter passcode"
        style={{ padding: "10px", margin: "10px" }}
        onChange={(e) => setEnteredPasscode(e.target.value)}
      />
      <Btn onClick={joinGame} text="Join Game" />
      <div style={{ marginTop: "20px" }}>
        <label>Grid Size: </label>
        <input
          type="number"
          className="rounded-full bg-transparent border-2 max-w-12 p-2 border-black"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          placeholder="Grid Size"
        />
      </div>
    </div>
  );
};

export default GameSetup;

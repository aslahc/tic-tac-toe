/* eslint-disable react/prop-types */
const GameSetup = ({
  passcode,
  error,
  setEnteredPasscode,
  gridSize,
  setGridSize,
  createGame,
  joinGame,
}) => (
  <div style={{ textAlign: "center", marginBottom: "20px" }}>
    <button
      className="px-4 py-2 m-2 bg-gray-900 rounded-full text-yellow-50 font-bold hover:bg-gray-700"
      onClick={createGame}
    >
      Create Game
    </button>
    {passcode && <p>Passcode: {passcode}</p>}
    <br />
    {error && <p style={{ color: "red" }}>{error}</p>}
    <input
      type="text"
      className="rounded-full bg-transparent border-2 border-black"
      placeholder="Enter passcode"
      style={{ padding: "10px", margin: "10px" }}
      onChange={(e) => setEnteredPasscode(e.target.value)}
    />
    <button
      className="px-4 py-2 m-2 bg-gray-900 rounded-full text-yellow-50 font-bold hover:bg-gray-700"
      onClick={joinGame}
    >
      Join Game
    </button>
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
export default GameSetup;

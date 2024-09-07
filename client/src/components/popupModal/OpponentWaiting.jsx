/* eslint-disable react/prop-types */

const OpponentWaiting = ({ passcode, copySuccess, handleCopy, makecancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-yellow-200 p-6 rounded-lg shadow-lg transform rotate-2 max-w-sm w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold font-handwriting">
            Waiting for Opponent
          </h2>
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
            ✖
          </button>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <p className="font-handwriting text-lg">
            Waiting for an opponent to join...
          </p>
          <div className="flex items-center space-x-2">
            <p className="font-handwriting text-lg">Passcode: {passcode}</p>
            <button
              onClick={handleCopy}
              className="text-blue-600 hover:text-blue-800 focus:outline-none font-handwriting"
            >
              Copy
            </button>
            {copySuccess && (
              <span className="text-green-600 font-handwriting">
                {copySuccess}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={makecancel}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-handwriting text-lg w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OpponentWaiting;

/* eslint-disable react/prop-types */
const Btn = ({ onClick, text }) => {
  return (
    <div>
      <button
        className="px-4 py-2 m-2 bg-gray-900 rounded-full text-yellow-50 font-bold hover:bg-gray-700"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Btn;

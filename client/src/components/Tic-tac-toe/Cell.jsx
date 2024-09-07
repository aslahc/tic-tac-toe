/* eslint-disable react/prop-types */
const Cell = ({ x, y, cellContent, cellStyle, onClick }) => (
  <div key={`${x}-${y}`} onClick={onClick} style={cellStyle}>
    <div className="relative w-full h-full">
      <div className="flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        {cellContent}
      </div>
      <div className="absolute inset-0 cell"></div>
    </div>
  </div>
);

export default Cell;

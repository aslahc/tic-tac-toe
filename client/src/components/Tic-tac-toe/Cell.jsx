/* eslint-disable react/prop-types */
const Cell = ({ x, y, cellContent, cellStyle, crossStyle, onClick }) => {
  console.log("this is in cell", cellContent, "----", cellStyle, cellStyle);

  return (
    <div key={`${x}-${y}`} onClick={onClick} style={cellStyle}>
      <div className="relative w-full h-full">
        <div className="flex items-center justify-center mt-7 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {cellContent}
        </div>
        <div className="absolute inset-0" style={crossStyle}></div>
      </div>
    </div>
  );
};

export default Cell;

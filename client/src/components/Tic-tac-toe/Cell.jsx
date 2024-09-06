/* eslint-disable react/prop-types */
const Cell = ({ x, y, cellContent, cellStyle, crossStyle, onClick }) => (
  <div key={`${x}-${y}`} onClick={onClick} style={cellStyle}>
    {cellContent}
    <div style={crossStyle}></div>
  </div>
);
export default Cell;

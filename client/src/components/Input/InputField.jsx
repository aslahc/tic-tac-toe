/* eslint-disable react/prop-types */

const InputField = ({ type, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      className="rounded-full bg-transparent border-2 border-black"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ padding: "10px", margin: "10px" }}
    />
  );
};

export default InputField;

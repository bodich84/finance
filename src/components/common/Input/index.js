import React from "react";
import "./styles.css";

const InputComponent = ({ state, setState, placeholder, type, id }) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={state}
        id={id}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputComponent;

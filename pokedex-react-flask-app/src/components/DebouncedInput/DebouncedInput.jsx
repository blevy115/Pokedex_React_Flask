import React, { forwardRef, useState } from "react";

import "./DebouncedInput.scss";

const DebouncedInput = forwardRef(function DebouncedInput(
  { label, placeholder, debouceTime = 500, onValueChange },
  ref
) {
  const [inputValue, setInputValue] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);

    clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      onValueChange(value);
    }, debouceTime);

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="debounced-input">
      <label>{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || "Type something..."}
        ref={ref}
      />
    </div>
  );
});

export default DebouncedInput;

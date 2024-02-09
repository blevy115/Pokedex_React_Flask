import React, { forwardRef, useState, useEffect } from "react";

import "./DebouncedInput.scss";

const DebouncedInput = forwardRef(function DebouncedInput(
  { label, placeholder, debouceTime = 500, onValueChange, initialValue = "" },
  ref
) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])

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

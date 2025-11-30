import React, { useState, useEffect } from "react";

function CustomSelect({ options = [], icon, defaultValue = "Pick a value", value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative w-full">
      {/* container */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center h-[56px] pl-3 pr-10 border-2 border-[#005FA1] rounded-[10px] cursor-pointer bg-white"
      >
        {/* icon on left */}
        {icon && <span className="text-[#005FA1]">{icon}</span>}

        {/* text in center */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 ${
            selected ? "text-black" : "text-gray-400"
          }`}
        >
          {selected || defaultValue}
        </span>

        {/* arrow */}
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="absolute right-3 w-6 h-6 text-[#005FA1]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="absolute right-3 w-6 h-6 text-[#005FA1]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </div>

      {/* options */}
      {isOpen && (
        <ul className="absolute mt-2  bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 ">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className={`py-2 px-4 text-center cursor-pointer ${
                selected === option
                  ? "bg-[#005FA1] text-white"
                  : "text-gray-700 hover:bg-[#005FA1] hover:text-white"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
